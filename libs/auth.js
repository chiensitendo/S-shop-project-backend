const { STATUS_CODES, ACCESS_TOKEN_SECRET, ROLES, VERIFY_TOKEN_SECRET } = require("./const");
const jwtUltility = require("./jwtUltility");
const moment = require("moment");

let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.query.token || req.headers["authorization"];
    let tokenRegex = /Bearer\s*(.*)/;
    if (tokenFromClient && tokenFromClient.match(tokenRegex)) {
        let token = tokenFromClient.match(tokenRegex)[1];
      try {
        const decoded = await jwtUltility.verifyToken(token, ACCESS_TOKEN_SECRET);
        const data = decoded.data;
        if (data && data.roles && (data.roles.includes(ROLES.CUSTOMER) || data.roles.includes(ROLES.ADMIN))){
          req.jwtDecoded = decoded;
          next();
        } else {
          return res.status(STATUS_CODES.UNAUTHORIZED).json({
            code: STATUS_CODES.UNAUTHORIZED,
            message: 'Không xác thực.',
          });          
        }
      } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            code: STATUS_CODES.UNAUTHORIZED,
            message: 'Không xác thực.',
        });
      }
    } else {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
          code: STATUS_CODES.BAD_REQUEST,
            message: 'Không tìm thấy token.',
      });
    }
  }

  let isVerifiedToken = async (id, verifyToken) => {
      try {
        const decoded = await jwtUltility.verifyToken(verifyToken, VERIFY_TOKEN_SECRET);
        const data = decoded.data;
        let n = moment.unix();
        if (data){
          if (decoded.exp < n){
            return {
              isVerified: false,
              message: "Token hết hạn!"
            }            
          }
          if (data._id !== +id){
            return {
              isVerified: false,
              message: "Token không xác thực!"
            }
          }
          return {
            isVerified: true
          }
        } else {
          return {
            isVerified: false,
            message: "Token không xác thực!"
          }  
        }
      } catch (error) {
        console.log(error);
        return {
          isVerified: false,
          message: error
        }  
      }
  }

  module.exports = {
    isAuth: isAuth,
    isVerifiedToken: isVerifiedToken
  };