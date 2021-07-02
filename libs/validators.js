const error = require("../libs/error.json");
const { STATUS_CODES } = require("./const");
const ultility = require("./functions");
function validateRegisterUserRequest(req, res, next) {
    const body = req.body;
    validateFields = ['username', 'password', 'email', 'provinceId', 'firstname', 'lastname', 'gender'];
    let isValid = ultility.requiredValidator(body, validateFields, res, next);
    if (isValid === true){
        isValid = isValid && ultility.passwordValidator(body, 'password', res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.emailValidator(body, 'email', res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.numberValidatorList(body, ['provinceId', 'gender'], res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.validateIdInCollection(body, req.provinces, 'provinceId', res, next);
    }
    
    return isValid;
}
function validateAddUserRequest(req, res, next) {
    
    const body = req.body;
    if (!body.name) {
        let err = error;
        err.message = "Thiếu trường 'name'.";
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        
        console.log(res.headersSent);
        next();
    }
  }

const validator = {
    validateRegisterUserRequest: validateRegisterUserRequest,
    validateAddUserRequest: validateAddUserRequest
}

module.exports = validator;