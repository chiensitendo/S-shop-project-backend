const error = require("../libs/error.json");
const { STATUS_CODES } = require("./const");
const ultility = require("./functions");
function validateRegisterUserRequest(req, res, next) {
    const body = req.body;
    validateFields = ['username', 'password', 'email', 'provinceId', 'firstname', 'lastname', 'gender', 'roleId', 'accountType'];
    let isValid = ultility.requiredValidator(body, validateFields, res, next);
    if (isValid === true){
        isValid = isValid && ultility.passwordValidator(body, 'password', res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.emailValidator(body, 'email', res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.numberValidatorList(body, ['provinceId', 'gender', 'roleId', 'accountType'], res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.validateIdInCollection(body, req.provinces, 'provinceId', res, next);
    }
    
    return isValid;
}

function validateRegisterGoogleUserRequest(params, res, next) {
    const body = params;
    console.log(params);
    validateFields = ['username', 'password', 'email', 'firstname', 'lastname', 'roleId'];
    let isValid = ultility.requiredValidator(body, validateFields, res, next);
    if (isValid === true){
        isValid = isValid && ultility.emailValidator(body, 'email', res, next);
    }
    if (isValid === true){
        isValid = isValid && ultility.numberValidatorList(body, ['roleId'], res, next);
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
    validateAddUserRequest: validateAddUserRequest,
    validateRegisterGoogleUserRequest: validateRegisterGoogleUserRequest
}

module.exports = validator;