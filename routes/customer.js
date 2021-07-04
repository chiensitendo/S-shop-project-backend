var express = require('express');
const setDefaultHeader = require('../libs/functions');
const {STATUS_CODES} = require('../libs/const');
const {insertCustomer,getCustomerList, deleteOneCustomer} = require('../services/customer-services');
const validator = require('../libs/validators');
const ultility = require('../libs/functions');
const Redis = require('../models/Redis');
var router = express.Router();


async function loadCustomer(req, res, next) {
   await getCustomerList().then(r => {
    req.CustomerList = r;
  }).catch(err => {
    req.CustomerList = null;
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
router.get('/', loadCustomer, function(req, res, next) {
  ultility.setDefaultHeader(res);
    if (!req.CustomerList){
      next();
    }
    res.status(STATUS_CODES.OK);
    res.json(req.CustomerList);
});

/* POST customers. */
router.post("/add", function (req, res, next) {
    ultility.setDefaultHeader(res);
    // dùng chung validator với user
    validator.validateAddUserRequest(req, res, next);
    insertCustomer(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? "Server Error": err.message);
    });
});
/* get customers. */
router.post("/dell", function (req, res) {
  ultility.setDefaultHeader(res);
  // res.send(req.body.id);
  deleteOneCustomer(req.body).then((r) => {
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

/* */
router.post("/",loadData, function (req, res, next) {
  ultility.setDefaultHeader(res);
  // dùng chung validator với user
  let isValid = validator.validateRegisterUserRequest(req, res, next);
  if (isValid){
    insertCustomer(req.body).then((r) => {
      res.status(STATUS_CODES.OK);
      res.json(r);
    }).catch(err => {
      res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
      res.json(!err.message ? "Server Error": err);
    });
  }
})


module.exports = router;
