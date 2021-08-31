const mongoose = require('mongoose');
const { STATUS_CODES, TIMEOUT_RESPONSE } = require('../libs/const');
var Schema = mongoose.Schema;
const error = require("../libs/error.json");
const response = require("../libs/response.json");
const { TimerSchema } = require('../schemas/timer');
const moment = require('moment');
const { VisitSchema } = require('../schemas/visit');
const { BlogCategoriesSchema } = require('../schemas/blog-category');

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

async function getVisit(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Visit = mongoose.connection.model('Visit', VisitSchema);
        Visit.find({id: id},function(err, objs) {
            if (err || !objs || objs.length === 0){
                let e = error;
                e.message = "Database Error";
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let obj = objs[0];
                resolve(obj);
            }
        });
    });
}

async function getTimer(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Timer = mongoose.connection.model('Timer', TimerSchema);
        Timer.find({id: id},function(err, objs) {
            if (err || !objs || objs.length === 0){
                let e = error;
                e.message = "Database Error";
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let obj = objs[0];
                resolve(obj);
            }
        });
    });    
}
async function createTimer(req, res, next) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Timer = mongoose.connection.model('Timer', TimerSchema);
        let timer = new Timer({
            id: req.params['id'],
            time: new Date()
        });
        timer.save(function(err) {
            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let r = response;
                r.code = STATUS_CODES.OK;
                r.message = 'Tạo timer thành công!';
                resolve(r);
            }
        });
    });
}

async function createVisit(req, res, next) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const Vist = mongoose.connection.model('Visit', VisitSchema);
        let timer = new Vist({
            id: req.params['id'],
            times: 0
        });
        timer.save(function(err) {
            if (err){
                let e = error;
                e.message = err.message;
                e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
                reject(e);
            } else {
                let r = response;
                r.code = STATUS_CODES.OK;
                r.message = 'Tạo visit thành công!';
                resolve(r);
            }
        });
    });
}

async function createBlogCategories(req, res, next) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let e = error;
            e.message = "Timeout";
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
             reject(e);   
        }, TIMEOUT_RESPONSE);
        const BlogCategories = mongoose.connection.model('BlogCategories', BlogCategoriesSchema);
        BlogCategories.insertMany([
            { id: 1, name: "Travel"},
            { id: 2, name: "Food"},
            { id: 3, name: "Bussiness"},
            { id: 4, name: "News"},
            { id: 5, name: "IT"},
            { id: 6, name: "Feeling"}
        ]).then(function(){
            let r = response;
            r.code = STATUS_CODES.OK;
            r.message = 'Tạo dữ liệu blog categories thành công!';
            resolve(r);
        }).catch(function(error){
            let e = error;
            e.message = err.message;
            e.code = STATUS_CODES.INTERNAL_SERVER_ERROR;
            reject(e);
        });
    });
}

module.exports = {
    getProvinceList: getProvinceList,
    getTimer: getTimer,
    createTimer: createTimer,
    createVisit: createVisit,
    getVisit: getVisit,
    createBlogCategories: createBlogCategories
};