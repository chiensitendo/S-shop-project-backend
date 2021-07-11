const mongoose = require('mongoose');
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const moment = require("moment");
const { TIMEOUT_RESPONSE, STATUS_CODES } = require('../libs/const');
const ultility = require('../libs/functions');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserInfoSchema = new Schema({
    firstname: String,
    lastname: String,
    address: String,
    gender: {
        type: Number,
        required: "Yêu cầu trường gender"
    },
    address: String
});

var UserSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    username: {
        type: String,
        required: "Yêu cầu trường username"
    },
    email: {
        type: String,
        required: "Yêu cầu trường email"
    },
    password: {
        type: String,
        required: "Yêu cầu trường password"
    },
    provinceId: {
        type: Number,
        required: "Yêu cầu trường provinceId"
    },
    info: UserInfoSchema,
    author: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate:  { type: Date },
    refreshToken: String
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
                    return ultility.convertUserSchemaToUserObject(value);
                });
                resolve(userList);
            }
        });
    });
}

async function getUser(loginIn) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const User = mongoose.connection.model('User', UserSchema);
        User.find( { $or:[ {'email': loginIn}, {'username': loginIn} ]}, 
        function(err,docs){
            if(!err){
                if (!docs || docs.length === 0){
                    let e = error;
                    e.message = "username hoặc email không tồn tại!";
                    e.code = STATUS_CODES.BAD_REQUEST;
                    reject(e);                           
                } else {
                    resolve(docs[0]);
                }
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
            User.find( { $or:[ {'email': params.email}, {'username':params.username} ]}, 
            function(err,docs){
                if(!err){
                    if (docs && docs.length > 0){
                        let e = error;
                        e.message = "username hoặc email đã tồn tại!";
                        e.code = STATUS_CODES.BAD_REQUEST;
                        reject(e);                           
                    } else {
                        bcrypt.hash(params.password, 10).then((hash) => {
                            const id = moment.now();
                            let user = new User({
                                id: id,
                                username: params.username,
                                email: params.email,
                                password: hash,
                                provinceId: +params.provinceId,
                                info: {
                                    firstname: params.firstname,
                                    lastname: params.lastname,
                                    gender: +params.gender,
                                    address: params.address
                                },
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
                        });
                    }
                }
            });

    })
}


module.exports = {
    insertUser: insertUser,
    getUserList: getUserList,
    getUser: getUser
};
