const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimerSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    time: {
        type: Date,
        default: new Date()
    },
});

module.exports = {
    TimerSchema: TimerSchema
}