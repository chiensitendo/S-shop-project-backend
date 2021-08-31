const mongoose = require('mongoose');
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const moment = require("moment");
const { TIMEOUT_RESPONSE, STATUS_CODES, ACCOUNT_TYPE, ACCESS_TOKEN_LIFE_N } = require('../libs/const');
const ultility = require('../libs/functions');
const bcrypt = require('bcrypt');
const { UserSchema } = require('../schemas/user');


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

async function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const User = mongoose.connection.model('User', UserSchema);
        User.find( { $or:[ {'id': id}]}, 
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

async function searchUserByLoginId(loginId) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const User = mongoose.connection.model('User', UserSchema);
        User.find( { $or:[ {'email': loginId}, {'username': loginId} ]}, 
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
                                isVerified: false,
                                accountType: +params.accountType,
                                provinceId: +params.provinceId,
                                roles: [+params.roleId],
                                isCompleted: true,
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
                                    resolve(user);
                                }
                            });
                        });
                    }
                }
            });

    })
}

async function insertFromGoogleUser(params) {
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
                            const expiredTime = moment().add(ACCESS_TOKEN_LIFE_N, "hours").unix();
                            let user = new User({
                                id: id,
                                username: params.username,
                                email: params.email,
                                password: hash,
                                expiredTime: expiredTime,
                                isVerified: params.isVerified,
                                accountType: ACCOUNT_TYPE.GOOGLE,
                                provinceId: params.provinceId ? +params.provinceId: null,
                                roles: [+params.roleId],
                                info: {
                                    firstname: params.firstname,
                                    lastname: params.lastname,
                                    gender: params.gender?+params.gender: params.gender,
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
                                    resolve(user);
                                }
                            });
                        });
                    }
                }
            });
    })
}

async function updateUser(user) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        user.save(function(err) {
            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                console.log('User successfully updated.');
                let res = response;
                res.code = STATUS_CODES.OK;
                res.message = 'Update user thành công!';
                resolve(res);
            }
        });
    })
}


module.exports = {
    insertUser: insertUser,
    getUserList: getUserList,
    searchUserByLoginId: searchUserByLoginId,
    getUser: getUser,
    insertFromGoogleUser: insertFromGoogleUser,
    updateUser: updateUser
};
