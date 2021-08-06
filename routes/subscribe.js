var express = require('express');
const {STATUS_CODES} = require('../libs/const');
const ultility = require('../libs/functions');
const { sendMail } = require('../services/email-service');
const { insertSubscribe } = require('../services/subscribe-services');
var router = express.Router();


router.post('', function (req, res, next) {
    ultility.setDefaultHeader(res);
    let isValid = ultility.requiredValidator(req.body, "name", res, next);
    isValid = isValid && ultility.requiredValidator(req.body, "email", res, next);
    isValid = isValid && ultility.emailValidator(req.body, "email", res, next);
    if (isValid){
        insertSubscribe(req.body['email'], req.body['name']).then(obj => {
            sendMail(req.body['name'], req.body['email']).then(res => res).catch(err => {
              console.log(err);
            });
            res.status(STATUS_CODES.OK);
            res.json(obj);
        }).catch(err => {
          res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
          res.json(!err.message ? {
            code: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Server Error"
          }: err);
        })
      };
});

module.exports = router;