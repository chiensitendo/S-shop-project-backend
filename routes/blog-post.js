var express = require('express');
const {STATUS_CODES} = require('../libs/const');
const ultility = require('../libs/functions');
const { sendMail, sendMailToMe } = require('../services/email-service');
const { insertSubscribe } = require('../services/subscribe-services');
var router = express.Router();


router.get('/top-post', function (req, res, next) {
    ultility.setDefaultHeader(res);
    res.send("OK");
});

module.exports = router;