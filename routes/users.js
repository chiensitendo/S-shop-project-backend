var express = require('express');
const {STATUS_CODES} = require('../libs/const');
const {insertUser, getUserList, getUser, searchUserByLoginId, updateUser} = require('../services/user-services');
const validator = require('../libs/validators');
const ultility = require('../libs/functions');
const Redis = require('../models/Redis');
const bcrypt = require('bcrypt');
const error = require("../libs/error.json");
const jwtUltility = require('../libs/jwtUltility');
const { isAuth, isVerifiedToken } = require('../libs/auth');
const { requiredValidator, numberValidator } = require('../libs/functions');
const { createToken } = require('../libs/bcryptUltility');
const SendMailEvents = require('../handlers/send-mail');
const LogRecorder = require('../handlers/log-recorder');
var router = express.Router();



async function loadUsers(req, res, next) {
   await getUserList().then(r => {
    req.userList = r;
  }).catch(err => {
    req.userList = null;
    if (!err || !err.code){
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
    } else {
      res.status(err.code);
    }
    if (!err || !err.message){
      res.json("Server Error");
    } else {
      res.json(err.message);
    }
  }).finally(() => {
    next();
  });
}

/* GET users listing. */
router.get('/', loadUsers, function(req, res, next) {
  ultility.setDefaultHeader(res);
    if (!req.userList){
      next();
    }
    res.status(STATUS_CODES.OK);
    res.json(req.userList);
});

router.post('/:id/refresh', function(req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    isValid = isValid && requiredValidator(req.body, "refreshToken", res, next);
    let refreshToken = req.body['refreshToken'];
    if (!isValid) {
        next();
    } else {
      getUser(id).then(user => {
        if (!user.refreshToken){
          res.status(STATUS_CODES.TOKEN_NOT_FOUND);
          res.json({
            code: STATUS_CODES.TOKEN_NOT_FOUND,
            message: "Không thấy refresh token."
          });
        } else {
          if (refreshToken === user.refreshToken){
            createToken(user, req, res, next).then(token => {
              user.refreshToken = token.refreshToken;
              user.save();
              res.json({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
              });
            }).catch(err => {
              next();
            })
          } else {
            res.status(STATUS_CODES.UNAUTHORIZED);
            res.json({
              code: STATUS_CODES.UNAUTHORIZED,
              message: "Không xác thực."
            })
          }
        }
      }).catch(err => {
        res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
        res.json(!err.message ? {
          code: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Server Error"
        }: err);
      });
    }
});

/* POST users. */
router.post("/add", function (req, res, next) {
    ultility.setDefaultHeader(res);
    validator.validateAddUserRequest(req, res, next);
    insertUser(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Server Error"
      }: err);
    });
});


async function loadData(req, res, next) {
  let cache = new Redis();
  req.provinces = [];
  await cache.getProvinceList().then(res => {
    let provinces = JSON.parse(res);
    req.provinces = provinces;
  }).catch(err => console.log("Không tìm thấy dữ liệu", err));
  next();
}
/** Login user */
router.post("/login", function (req, res, next) {
    ultility.setDefaultHeader(res);
    let isValid = ultility.requiredValidator(req.body, "loginId", res, next);
    isValid = isValid && ultility.requiredValidator(req.body, "password", res, next);
    if (isValid){
      searchUserByLoginId(req.body['loginId']).then(user => {
        bcrypt.compare(req.body['password'], user.password).then(isVal => {
            if (isVal){
              createToken(user, req, res, next).then(token => {
                user.refreshToken = token.refreshToken;
                user.save();
                res.json({
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  accessToken: token.accessToken,
                  refreshToken: token.refreshToken
                });
              }).catch(err => {
                next();
              })
            } else {
              let e = error;
              e.message = "Mật khẩu không đúng!";
              e.code = STATUS_CODES.BAD_REQUEST;
              res.status(STATUS_CODES.BAD_REQUEST);
              res.json(e);
            }
        }).catch(er => console.log(er));
      }).catch(err => {
        res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
        res.json(!err.message ? {
          code: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Server Error"
        }: err);
      })
    };
    
});

/* Register users */
router.post("/",loadData, function (req, res, next) {
  ultility.setDefaultHeader(res);
  let isValid = validator.validateRegisterUserRequest(req, res, next);
  if (isValid){
    insertUser(req.body).then((user) => {
      LogRecorder.emit("reg-com-log", user.id);
      SendMailEvents.emit("reg-welcome-mail", user);
      SendMailEvents.emit("reg-verify-mail", user);
      res.status(STATUS_CODES.OK);
      res.json(user.id);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Server Error"
      }: err);
    });
  }
});

router.post("/verify", function (req, res, next) {
  ultility.setDefaultHeader(res);
  let isValid = ultility.requiredValidator(req.body, "id", res, next);
  isValid = isValid && ultility.requiredValidator(req.body, "verifyToken", res, next);
  if (isValid){
    const {id, verifyToken} = req.body;
    getUser(id).then(user => {
      if (user.isVerified){
        res.status(STATUS_CODES.BAD_REQUEST).send({
          code: STATUS_CODES.BAD_REQUEST,
          message: "Token hết hiệu lực!",
        });
        return;
      }
      isVerifiedToken(id, verifyToken).then(r => {
        if (r.isVerified) {
          user.isVerified = true;
          updateUser(user).then(e => {
            res.status(STATUS_CODES.OK).send({
              isVerified: true
            });
          }).catch(err => {
            throw err;
          })
        } else {
          res.status(STATUS_CODES.BAD_REQUEST).send({
            code: STATUS_CODES.BAD_REQUEST,
            message: r.message,
          });
        }
      }).catch (err => {throw err});
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Server Error"
      }: err);
    })
  }
});


module.exports = router;
