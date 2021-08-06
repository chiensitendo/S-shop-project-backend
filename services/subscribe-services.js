const mongoose = require('mongoose');
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const moment = require("moment");
const { TIMEOUT_RESPONSE, STATUS_CODES } = require('../libs/const');
const ultility = require('../libs/functions');
const bcrypt = require('bcrypt');
const { SubscribeSchema } = require('../schemas/subscribe');
var Schema = mongoose.Schema;

async function insertSubscribe(email, name) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
            const Subcribe = mongoose.connection.model('Subscribes', SubscribeSchema);
            Subcribe.find( { $or:[ {'email': email} ]}, 
            function(err,docs){
                if(!err){
                    if (docs && docs.length > 0){
                        let e = error;
                        e.message = "email đã được đăng ký!";
                        e.code = STATUS_CODES.BAD_REQUEST;
                        reject(e);                           
                    } else {
                            const id = moment.now();
                            let subcribe = new Subcribe({
                                id: id,
                                email: email,
                                name: name
                            });
                            subcribe.save(function(err) {
                                if (err){
                                    console.log(err);
                                    let e = error;
                                    e.message = err.message;
                                    e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                                    reject(e);
                                } else {
                                    console.log('Suscribed successfully');
                                    let res = response;
                                    res.code = STATUS_CODES.OK;
                                    res.message = 'Đăng ký thành công!';
                                    resolve(res);
                                }
                            });
                    }
                }
            });
    })
}

module.exports = {
    insertSubscribe: insertSubscribe
};