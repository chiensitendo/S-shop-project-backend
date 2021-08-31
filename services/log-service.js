const mongoose = require('mongoose');
const { STATUS_CODES, TIMEOUT_RESPONSE, LOG_TYPE } = require('../libs/const');
var Schema = mongoose.Schema;
const error = require("../libs/error.json");
const { LogSchema } = require('../schemas/log');

async function createRegisterLog(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Log = mongoose.connection.model('Log', LogSchema);
        let log = new Log({
            logType: LOG_TYPE.REGISTER,
            user: {
                id: id
            }
        });
        log.save(function(err) {
            if (err){
                reject(err);
            } else {
                resolve({});
            }
        });
    });
}

async function createLoginLog(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Log = mongoose.connection.model('Log', LogSchema);
        let log = new Log({
            logType: LOG_TYPE.LOGIN,
            user: {
                id: id
            }
        });
        log.save(function(err) {
            if (err){
                reject(err);
            } else {
                resolve({});
            }
        });
    });
}

async function createErrorLog(err, path) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Log = mongoose.connection.model('Log', LogSchema);
        let log = new Log({
            logType: LOG_TYPE.ERROR,
            message: JSON.stringify(err),
            path: path
        });
        log.save(function(err) {
            if (err){
                reject(err);
            } else {
                resolve({});
            }
        });
    });
}

module.exports = {
    createRegisterLog: createRegisterLog,
    createErrorLog: createErrorLog,
    createLoginLog: createLoginLog
};