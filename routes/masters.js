var express = require('express');
const { STATUS_CODES, DATETIME_FULL_FORMAT } = require('../libs/const');
const { numberValidator, getNumberString } = require('../libs/functions');
const { getTimer, createTimer, createVisit, getVisit } = require('../services/master-services');
var router = express.Router();
const moment = require('moment');
const IO = require('../models/io');
async function checkId(req, res, next) {
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    req.isValid = isValid;
    next();
}

router.post('/timer/:id', checkId, function (req, res, next) {
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

router.post('/visit/:id', checkId, function (req, res, next) {
    if (req.isValid) {
        createVisit(req, res, next).then(r => {
            res.status(r.code);
            res.json(r);            
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        })
    }
});

router.put('/visit/:id', checkId, function (req, res, next) {
    if (req.isValid) {
        let id  = req.params['id'];
        getVisit(id).then(r => {
            r.times = r.times+1;
            r.save(function(err) {
                if (err){
                    let e = {};
                    e.message = err.message;
                    e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                    res.status(e.code);
                    res.json(e);
                } else {
                    let r = {};
                    r.code = STATUS_CODES.OK;
                    r.message = 'Cập nhật visit thành công!';
                    res.status(r.code);
                    res.json(r);
                }
            });
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        });
    }
});

router.get('/visit/:id', function (req, res, next) {
    let io =  new IO().getIO();
    // console.log(io.engine.clients);
    io.sockets.emit("visit", "There is someone visited our system at " + moment().format(DATETIME_FULL_FORMAT));
    let id  = req.params['id'];
    let isValid = numberValidator(id, 'id', res, next);
    if (!isValid) {
        next();
    } else {
        getVisit(id).then(r => {
            res.json({
                times: r.times
            });
        }).catch(err => {
            res.status(!err.code? STATUS_CODES.INTERNAL_SERVER_ERROR: err.code);
            res.json(!err.message ? "Server Error": err);
        });
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