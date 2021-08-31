const bcrypt = require('bcrypt');
const { createErrorLog } = require('../services/log-service');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE, STATUS_CODES, VERIFY_TOKEN_SECRET, VERIFY_TOKEN_LIFE } = require('./const');
const jwtUltility = require('./jwtUltility');

let createToken = async (user, req, res, next) =>  {
        try {
            let userToken = {
                _id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
            let accessToken = await jwtUltility.generateToken(userToken, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
            let refreshToken = await jwtUltility.generateToken(userToken, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
            return ({
                accessToken: accessToken,
                refreshToken: refreshToken                
            })
        } catch (err){
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
            res.json({
                code: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: "Server Error"
            });
            throw err;
        }
}

let createTokenNoRes = async (user) =>  {
    try {
        let userToken = {
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles
        }
        let accessToken = await jwtUltility.generateToken(userToken, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
        let refreshToken = await jwtUltility.generateToken(userToken, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
        return ({
            accessToken: accessToken,
            refreshToken: refreshToken                
        })
    } catch (err){
        throw err;
    }
}

let createVerifyToken = async (user) =>  {
    try {
        let userToken = {
            _id: user.id,
            username: user.username,
            email: user.email
        }
        let verifyToken = await jwtUltility.generateToken(userToken, VERIFY_TOKEN_SECRET, VERIFY_TOKEN_LIFE);
        return verifyToken;
    } catch (err){
        createErrorLog(err, "function: createVerifyToken | libs//bcryptUltility.js");
        throw err;
    }
}

module.exports = {
    createToken: createToken,
    createVerifyToken: createVerifyToken,
    createTokenNoRes: createTokenNoRes
}