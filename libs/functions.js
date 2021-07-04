const error = require("../libs/error.json");
const { STATUS_CODES, REQUIRED_VALIDATOR_TEXT, PASSWORD_VALIDATOR_TEXT, EMAIL_VALIDATOR_TEXT, NUMBER_VALIDATOR_TEXT, NOT_AVAILABLE_TEXT } = require("./const");

function setDefaultHeader(res) {
    res.setHeader("Content-type", 'application/json');
}

function convertUserSchemaToUserObject(schema) {
    let user = {};
    user.id = schema.id;
    user.name = schema.name;
    user.createdDate = schema.createdDate;
    if (schema.updatedDate) {
        user.updatedDate = schema.updatedDate;
    }
    return user;
}

function requiredValidator(obj, fieldName, res, next) {
    let isValid = true;
    if (fieldName instanceof Array){
        for (let index = 0; index < fieldName.length; index++) {
            const element = fieldName[index];
            let valid =  requiredValidatorObject(obj[element],element, res, next);
            if (valid === false){
                isValid = false;
                break;
            }
        }
        return isValid;
    } else {  
        return requiredValidatorObject(obj[fieldName],fieldName,  res, next);
    }
}
function requiredValidatorObject(obj, fieldName, res, next) {
    let isValid = true;
    if (!obj) {
        let err = error;
        err.message = [REQUIRED_VALIDATOR_TEXT].join().replace('$field', fieldName);
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid;
}
function passwordValidator(obj, fieldName, res, next) {
    let isValid = true;
    if (![obj[fieldName]].join().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
        let err = error;
        err.message = PASSWORD_VALIDATOR_TEXT;
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid;
}
function numberValidatorList(obj, fieldName, res, next) {
    let isValid = true;
    if (fieldName instanceof Array){
        for (let index = 0; index < fieldName.length; index++) {
            const element = fieldName[index];
            let valid =  numberValidator(obj[element],element, res, next);
            if (valid === false){
                isValid = false;
                break;
            }
        }
        return isValid;
    } else {  
        return numberValidator(obj[fieldName],fieldName,  res, next);
    }
}
function numberValidator(obj, fieldName, res, next) {
    let isValid = true;
    var reg = /^-?\d+\.?\d*$/;
    if ((![obj].join().match(reg))){
        let err = error;
        err.message = [NUMBER_VALIDATOR_TEXT].join().replace('$field', fieldName);
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid; 
}
function emailValidator(obj, fieldName, res, next) {
    let isValid = true;
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (![obj[fieldName]].join().match(regex)) {
        let err = error;
        err.message = EMAIL_VALIDATOR_TEXT;
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid;
}

function validateIdInCollection(obj, collecttion, fieldName, res, next) {
    let isValid = true;
    if (collecttion && collecttion instanceof Array){
        let findItem  = collecttion.find(val => {
            return +val.id === +obj[fieldName];
        });
        if (!findItem){
            let err = error;
            err.message = [NOT_AVAILABLE_TEXT].join().replace('$field', fieldName);
            err.code = STATUS_CODES.BAD_REQUEST;
            res.status(STATUS_CODES.BAD_REQUEST);
            res.json(err);
            isValid = false;
        }
    } else {
        let err = error;
        err.message = [NOT_AVAILABLE_TEXT].join().replace('$field', fieldName);
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid;
}
function validateInCollection(obj, collecttion, fieldName, res, next) {
    let isValid = true;
    if (collecttion && collecttion instanceof Array){
        let findItem  = collecttion.find(val => {
            return val === obj[fieldName];
        });
        if (!findItem){
            let err = error;
            err.message = [NOT_AVAILABLE_TEXT].join().replace('$field', fieldName);
            err.code = STATUS_CODES.BAD_REQUEST;
            res.status(STATUS_CODES.BAD_REQUEST);
            res.json(err);
            isValid = false;
        }
    } else {
        let err = error;
        err.message = [NOT_AVAILABLE_TEXT].join().replace('$field', fieldName);
        err.code = STATUS_CODES.BAD_REQUEST;
        res.status(STATUS_CODES.BAD_REQUEST);
        res.json(err);
        isValid = false;
    }
    return isValid;
}
const ultility = {
    requiredValidator: requiredValidator,
    setDefaultHeader: setDefaultHeader,
    convertUserSchemaToUserObject: convertUserSchemaToUserObject,
    passwordValidator: passwordValidator,
    emailValidator: emailValidator,
    numberValidatorList: numberValidatorList,
    numberValidator: numberValidator,
    validateIdInCollection: validateIdInCollection,
    validateInCollection: validateInCollection
}
module.exports = ultility;