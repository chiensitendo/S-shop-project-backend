const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscribeSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String,
        require: "Yêu cầu trường email"
    },
    name: {
        type: String,
        require: "Yêu cầu trường name"
    },
    isSent: {
        type: Boolean,
        default: false
    },
});

module.exports = {
    SubscribeSchema: SubscribeSchema
}