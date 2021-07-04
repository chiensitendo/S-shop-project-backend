const mongoose = require('mongoose');
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const moment = require("moment");
const { TIMEOUT_RESPONSE, STATUS_CODES } = require('../libs/const');
const ultility = require('../libs/functions');
var Schema = mongoose.Schema;

var CustomerInfoSchema = new Schema({
    firstname: String,
    lastname: String,
    address: String,
    gender: {
        type: Number,
        required: "Yêu cầu trường gender"
    },
    address: String
});

var CustomerSchema = new Schema({
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
        required: "Yêu cầu trường email",
        unique : true
    },
    password: {
        type: String,
        required: "Yêu cầu trường password"
    },
    provinceId: {
        type: Number,
        required: "Yêu cầu trường provinceId"
    },
    info: CustomerInfoSchema,
    author: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate:  { type: Date },
});


async function getCustomerList() {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Customer = mongoose.connection.model('Customers', CustomerSchema);
        
        Customer.find({},function(err, Customer) {

            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let CustomerList = [];
                CustomerList = Customer.map(value => {
                    return ultility.convertUserSchemaToUserObject(value);
                });
                resolve(CustomerList);
            }
        });
    });
}

async function insertCustomer(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
            const Customer = mongoose.connection.model('Customers', CustomerSchema);
            Customer.find( { $or:[ {'email': params.email}, {'username':params.username} ]}, 
            function(err,docs){
                if(!err){
                    if (docs && docs.length > 0){
                        let e = error;
                        e.message = "username hoặc email đã tồn tại!";
                        e.code = STATUS_CODES.BAD_REQUEST;
                        reject(e);                           
                    } else {
                        const id = moment.now();
                        let customer = new Customer({
                            id: id,
                            username: params.username,
                            email: params.email,
                            password: params.password,
                            provinceId: +params.provinceId,
                            info: {
                                firstname: params.firstname,
                                lastname: params.lastname,
                                gender: +params.gender,
                                address: params.address
                            }
                        });
                        customer.save(function(err,data) {
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
                    }
                }
            });

    })
}


module.exports = {
    insertCustomer: insertCustomer,
    getCustomerList: getCustomerList
};
