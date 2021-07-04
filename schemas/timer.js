const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimerSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    seconds: {
        type: String,
        default: "00"
    },
    minutes: {
        type: String,
        default: "00"
    },
    hours: {
        type: String,
        default: "00"
    },
    days: {
        type: String,
        default: "0"
    }
});

module.exports = {
    TimerSchema: TimerSchema
}