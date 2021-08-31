var express = require('express');
var router = express.Router();
const {STATUS_CODES, ROLES, ACCOUNT_TYPE, FRONT_END_URL} = require('../../libs/const');
const passport = require('passport');
const ultility = require('../../libs/functions');
const validator = require('../../libs/validators');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const error = require("../../libs/error.json");
var generator = require('generate-password');
const { insertFromGoogleUser, searchUserByLoginId } = require('../../services/user-services');
const IO = require('../../models/io');
const events = require("events");
const SendMailEvents = require('../../handlers/send-mail');
const LogRecorder = require('../../handlers/log-recorder');
const GOOGLE_CLIENT_ID = '223430095187-uft3av5prvn9hg6rbojcd6g4200b87ck.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '7cFWYqbwsvylAVRs6YnOpFc-';
const UserHandler = require('../../handlers/user-handler');
const { createTokenNoRes } = require('../../libs/bcryptUltility');
passport.use("google-register", new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/oauth2callback",
    scope: ['profile', 'email'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    const id  = req.query.state;
    if (id){
      profile.socketId = id;
    }
    if (profile.emails.length === 0 || !profile.emails[0].value){
      let err = error;
      err.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
      err.message = "Lỗi google server!";
      profile.errors = err;
      cb(err);
    } else {
      let email = profile.emails[0].value;
      if (profile.emails[0].verified !== true){
        let err = error;
        err.code = STATUS_CODES.NOT_VERIFIED;
        err.message = "Gmail của bạn chưa được xác thực!";
        profile.error = err;
        return cb(null, profile);
      }
      var password = generator.generate({
        length: 10,
        numbers: true
      });
      let params = {
        id: profile.id,
        username: email,
        email: email,
        password: password,
        accountType: ACCOUNT_TYPE.GOOGLE,
        isVerified: true
      }
      if (profile.name){
        params.firstname = profile.name.familyName;
        params.lastname = profile.name.givenName;
      }
      if (profile.photos && profile.photos.length > 0 && profile.photos[0].value) {
        params.photos = profile.photos[0].value;
      }
      params.roleId = ROLES.CUSTOMER;
      let isValid = validator.validateRegisterGoogleUserRequest(params, null, null);
      if (!isValid) {
        let err = error;
        err.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
        err.message = "Lỗi google server!";
        cb(err);
        return;
      }
      insertFromGoogleUser(params).then(user => {
        LogRecorder.emit("reg-com-log", user.id);
        SendMailEvents.emit("reg-welcome-mail", user);
        profile.email = email;
        return cb(null, profile);
      }).catch(err => {
        let e = error;
        e.code = !err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code;
        e.message = err.message ? err.message : "Server Error";
        profile.error = e;
        return cb(null, profile);
      });  
    }


  }
));

passport.use("google-login", new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/google/oauth2/login/callback",
  scope: ['profile', 'email'],
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, cb) {
  const id  = req.query.state;
  if (id){
    profile.socketId = id;
  }
  console.log("profile", profile);
  if (profile.emails.length === 0 || !profile.emails[0].value){
    let err = error;
    err.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
    err.message = "Lỗi google server!";
    profile.errors = err;
    cb(err);
  } else {
    let email = profile.emails[0].value;
    if (profile.emails[0].verified !== true){
      let err = error;
      err.code = STATUS_CODES.NOT_VERIFIED;
      err.message = "Gmail của bạn chưa được xác thực!";
      profile.error = err;
      return cb(null, profile);
    }

    searchUserByLoginId(email).then(user => {
      createTokenNoRes(user).then(token => {
        if (profile.photos && profile.photos.length > 0 && profile.photos[0] && profile.photos[0].value){
          user.avatar = {
            imageUrl: profile.photos[0].value
          }
        }
        user.refreshToken = token.refreshToken;
        LogRecorder.emit("login-com-log", user.id);
        UserHandler.emit("login-com", user);
        let res = {
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          roles: user.roles,
          accountType: user.accountType,
          isCompleted: user.isCompleted,
        };
        if (user.info){
          res.firstname = user.info.firstname;
          res.lastname = user.info.lastname;
        }
        if (user.avatar.imageUrl){
          res.avatarUrl = user.avatar.imageUrl;
        }
        profile.res = res;
        return cb(null, profile);
        }).catch(err => {
          throw err;
      })
    }).catch(err => {
      let e = error;
      e.code = !err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code;
      e.message = err.message ? err.message : "Server Error";
      profile.error = e;
      return cb(null, profile);
    });  
  }
}
));

router.get('/oauth2callback',passport.authenticate('google-register', { failureRedirect: `${FRONT_END_URL}/login` , session: false}), function(req, res, next) {
    ultility.setDefaultHeader(res);
    
    let user = req.user;
    const socketId = user.socketId;
    let socket =  new IO().getSocketById(socketId);
    if (!user){
      res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${STATUS_CODES.INTERNAL_SERVER_ERROR}&message=${'Server Error'}`);
      if (socket){
        socket.emit("register-fail", {
          code: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Server Error"
        });
      }
    } else {
      if (user.error){
        if (user.error.code !== STATUS_CODES.NOT_VERIFIED){
          res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${user.error.code}&message=${user.error.message}`);
          if (socket){
            socket.emit("register-fail", {
              code: user.error.code,
              message: user.error.message
            });
          }
        } else {
          res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${user.error.code}&message=${user.error.message}`);
          if (socket){
            socket.emit("register-error", {
              code: user.error.code,
              message: user.error.message
            });
          }
        }

      } else {
        res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=true`);
        if (socket){
          socket.emit("register-success", {
            email: user.email
          });
        }
      }
    }
});

router.get('/oauth2/login/callback',passport.authenticate('google-login', { failureRedirect: `${FRONT_END_URL}/login` , session: false}), function(req, res, next) {
  ultility.setDefaultHeader(res);
  
  let user = req.user;
  const socketId = user.socketId;
  let socket =  new IO().getSocketById(socketId);
  if (!user && !user.res){
    res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${STATUS_CODES.INTERNAL_SERVER_ERROR}&message=${'Server Error'}`);
    if (socket){
      socket.emit("login-fail", {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Server Error"
      });
    }
  } else {
    if (user.error){
      if (user.error.code !== STATUS_CODES.NOT_VERIFIED){
        res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${user.error.code}&message=${user.error.message}`);
        if (socket){
          socket.emit("login-fail", {
            code: user.error.code,
            message: user.error.message
          });
        }
      } else {
        res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=false&code=${user.error.code}&message=${user.error.message}`);
        if (socket){
          socket.emit("login-error", {
            code: user.error.code,
            message: user.error.message
          });
        }
      }

    } else {
      res.redirect(`${FRONT_END_URL}/auth/google?isSuccess=true`);
      if (socket){
        socket.emit("login-success", user.res);
      }
    }
  }
});

router.get('/auth', function(req, res, next) {
  const {id} = req.query;
  passport.authenticate('google-register', { scope : ['profile', 'email'], 
failureRedirect: `${FRONT_END_URL}/login` , session: false, passReqToCallback: true, state: id })(req, res, next);
});

router.get('/login', function(req, res, next) {
  const {id} = req.query;
  passport.authenticate('google-login', { scope : ['profile', 'email'], 
failureRedirect: `${FRONT_END_URL}/login` , session: false, passReqToCallback: true, state: id })(req, res, next);
});

module.exports = router;
