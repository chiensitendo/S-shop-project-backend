const { STATUS_CODES, ACCESS_TOKEN_SECRET } = require("./const");
const jwtUltility = require("./jwtUltility");

let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.query.token || req.headers["authorization"];
    let tokenRegex = /Bearer\s*(.*)/;
    if (tokenFromClient && tokenFromClient.match(tokenRegex)) {
        let token = tokenFromClient.match(tokenRegex)[1];
      try {
        const decoded = await jwtUltility.verifyToken(token, ACCESS_TOKEN_SECRET);
        req.jwtDecoded = decoded;
        next();
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

  module.exports = {
    isAuth: isAuth,
  };