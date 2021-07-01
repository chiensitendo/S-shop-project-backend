const mongoose = require('mongoose');
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const moment = require("moment");
const STATUS_CODES = require('../libs/const');
const convertUserSchemaToUserObject = require('../libs/functions');
const { TIMEOUT_RESPONSE } = require('../libs/const');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    author: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate:  { type: Date },
});


async function getUserList() {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const User = mongoose.connection.model('User', UserSchema);
        
        User.find({},function(err, users) {

            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let userList = [];
                userList = users.map(value => {
                    return convertUserSchemaToUserObject(value);
                });
                resolve(userList);
            }
        });
    });
}

async function insertUser(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
            const User = mongoose.connection.model('User', UserSchema);
            const id = moment.now();
            let user = new User({
                id: id,
                name: params.name,
                author: "TRAN MINH SANG"
            });
            user.save(function(err) {
                if (err){
                    console.log(err);
                    let e = error;
                    e.message = err.message;
                    e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                    reject(e);
                } else {
                    console.log('User successfully saved.');
                    let res = response;
                    res.code = STATUS_CODES.OK;
                    res.message = 'Tạo user thành công!';
                    resolve(res);
                }
                
            });
    })
}


module.exports = {
    insertUser: insertUser,
    getUserList: getUserList
};
