var express = require('express');
const { STATUS_CODES } = require('../libs/const');
const { numberValidator, requiredValidator, validateInCollection } = require('../libs/functions');
const { getTimer, saveTimerSchema } = require('../services/master-services');
var router = express.Router();

let timers = ['days', 'hours', 'minutes', 'seconds'];

async function saveTimer(req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    let body = req.body;
    isValid = isValid && requiredValidator(body, ['value', 'type'], res, next);
    isValid = isValid && numberValidator(body.value, 'value', res, next);
    isValid = isValid && validateInCollection(body, timers, 'type', res, next);
    req.isValid = isValid;
    if (isValid) {
        await getTimer(id).then(r => {
            req.timer = r;
            next();
        }).catch(err => {
            req.isValid = false;
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        });
    }
}

router.post('/timer/:id', saveTimer, function (req, res, next) {
    if (req.isValid) {
        saveTimerSchema(req, res, next).then(r => {
            res.status(r.code);
            res.json(r);            
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        })
    } else {
        next();
    }
});

router.get('/timer/:id', function (req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    if (!isValid) {
        next();
    } else {
        getTimer(id).then(r => {
            res.json({
                seconds: r.seconds,
                minutes: r.minutes,
                hours: r.hours,
                days: r.days
            });
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        })
    }
});

module.exports = router;