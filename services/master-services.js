const mongoose = require('mongoose');
const { STATUS_CODES, TIMEOUT_RESPONSE } = require('../libs/const');
var Schema = mongoose.Schema;
const error = require("../libs/error.json");
const response = require("../libs/response.json");

var WardSchema = new Schema({
    id: {
        type: String,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    prefix: {
        type: String,
        required: "Yêu cầu trường prefix"
    },
});

var ProjectSchema = new Schema({
    id: {
        type: String,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    prefix: {
        type: String,
        required: "Yêu cầu trường prefix"
    },
    lat: {
        type: String,
        required: "Yêu cầu trường lat"
    },
    lng: {
        type: String,
        required: "Yêu cầu trường prefix"
    },
});

var StreetSchema = new Schema({
    id: {
        type: String,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    prefix: {
        type: String,
        required: "Yêu cầu trường prefix"
    },
});

var DistrictSchema = new Schema({
    id: {
        type: String,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    wards: [WardSchema],
    streets: [StreetSchema],
    projects: [ProjectSchema],
    author: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate:  { type: Date }
});

var ProvinceSchema = new Schema({
    id: {
        type: String,
        required: "Yêu cầu trường id"
    },
    name: {
        type: String,
        required: "Yêu cầu trường name"
    },
    code: {
        type: String,
        required: "Yêu cầu trường code"       
    },
    districts: [DistrictSchema]
});

async function getProvinceList() {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Province = mongoose.connection.model('Province', ProvinceSchema);
        Province.find({},function(err, users) {

            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let userList = [];
                userList = users.map(value => {
                    return {id: value.id, name: value.name};
                });
                resolve(userList);
            }
        });
    });
}

module.exports = {
    getProvinceList: getProvinceList,
};