var express = require('express');
const {STATUS_CODES} = require('../libs/const');
const {insertUser, getUserList} = require('../services/user-services');
const validator = require('../libs/validators');
const ultility = require('../libs/functions');
const Redis = require('../models/Redis');
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
