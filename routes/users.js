var express = require('express');
const setDefaultHeader = require('../libs/functions');
const error = require("../libs/error.json");
const {STATUS_CODES} = require('../libs/const');
const {insertUser, getUserList} = require('../services/user-services');
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
    setDefaultHeader(res);
    if (!req.userList){
      next();
    }
    res.status(STATUS_CODES.OK);
    res.json(req.userList);
});

function validateUserRequest(req, res, next) {
  const body = req.body;
  if (!body.name){
    let err = error;
    err.message = "Thiếu trường 'name'.";
    err.code = STATUS_CODES.BAD_REQUEST;
    res.status(STATUS_CODES.BAD_REQUEST);
    res.json(err);
    next();
  }
}

router.post("/", function (req, res, next) {
    setDefaultHeader(res);
    validateUserRequest(req, res, next);
    insertUser(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? "Server Error": err.message);
    });
  
});

module.exports = router;
