var express = require('express');
const {STATUS_CODES, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE} = require('../libs/const');
const {insertUser, getUserList, getUser} = require('../services/user-services');
const validator = require('../libs/validators');
const ultility = require('../libs/functions');
const Redis = require('../models/Redis');
const bcrypt = require('bcrypt');
const error = require("../libs/error.json");
const jwtUltility = require('../libs/jwtUltility');
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

/* POST users. */
router.post("/add", function (req, res, next) {
    ultility.setDefaultHeader(res);
    validator.validateAddUserRequest(req, res, next);
    insertUser(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? "Server Error": err.message);
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

router.post("/login", function (req, res, next) {
    ultility.setDefaultHeader(res);
    let isValid = ultility.requiredValidator(req.body, "loginId", res, next);
    isValid = isValid && ultility.requiredValidator(req.body, "password", res, next);
    if (isValid){
      getUser(req.body['loginId']).then(user => {
        bcrypt.compare(req.body['password'], user.password).then(isVal => {
            if (isVal){
                let userToken = {
                  _id: user.id,
                  username: user.username,
                  email: user.email
                }
                let accessTokenASync = jwtUltility.generateToken(userToken, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
                let refreshTokenASync = jwtUltility.generateToken(userToken, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
                Promise.all([accessTokenASync, refreshTokenASync]).then((tokens) => {
                  user.refreshToken = tokens[1];
                  user.save();
                  res.status(STATUS_CODES.OK);
                  res.json({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    accessToken: tokens[0],
                    refreshToken: tokens[1]
                  });
                });
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
        res.json(!err.message ? "Server Error": err);
      })
    };
    
});

/* Register users */
router.post("/",loadData, function (req, res, next) {
  ultility.setDefaultHeader(res);
  let isValid = validator.validateRegisterUserRequest(req, res, next);
  if (isValid){
    insertUser(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? "Server Error": err);
    });
  }
})


module.exports = router;
