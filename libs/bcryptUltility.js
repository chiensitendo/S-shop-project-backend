const bcrypt = require('bcrypt');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE, STATUS_CODES } = require('./const');
const jwtUltility = require('./jwtUltility');

let createToken = async (user, req, res, next) =>  {
        try {
            let userToken = {
                _id: user.id,
                username: user.username,
                email: user.email
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

module.exports = {
    createToken: createToken
}