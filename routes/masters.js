var express = require('express');
const { STATUS_CODES } = require('../libs/const');
const { numberValidator, getNumberString } = require('../libs/functions');
const { getTimer, createTimer } = require('../services/master-services');
var router = express.Router();
const moment = require('moment');

async function saveTimer(req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    req.isValid = isValid;
    next();
}

router.post('/timer/:id', saveTimer, function (req, res, next) {
    if (req.isValid) {
        createTimer(req, res, next).then(r => {
            res.status(r.code);
            res.json(r);            
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        })
    }
});

router.get('/timer/:id', function (req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    if (!isValid) {
        next();
    } else {
        getTimer(id).then(r => {
            let m = moment(r.time);
            let now = moment();
            let seconds = now.diff(m,'seconds');
            let minutes = now.diff(m,'minutes');
            let hours = now.diff(m,'hours');
            res.json({
                seconds: getNumberString(seconds % 60),
                minutes: getNumberString(minutes % 60),
                hours: getNumberString(hours % 24),
                days: getNumberString(now.diff(m,'days'))
            });

        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        });
    }
});

module.exports = router;