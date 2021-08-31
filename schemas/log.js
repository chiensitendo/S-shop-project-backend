const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    }
})
var LogSchema = new Schema({
    logType: {
        type: Number,
        required: "Yêu cầu trường logType"
    },
    user: {
        type: UserSchema
    },
    message: {
        type: String
    },
    path: {
        type: String
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = {
    LogSchema: LogSchema
}