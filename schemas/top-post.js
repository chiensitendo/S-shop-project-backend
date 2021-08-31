const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopPostSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    updatedDate: {
        type: Date,
        default: new Date()
    },
    title: {
        type: String,
        require: "Yêu cầu trường title"
    },
    description: {
        type: String,
        require: "Yêu cầu trường description"
    },
    categoryId: {
        type: Number,
        require: "Yêu cầu trường categoryId"
    },
    image: {
        type: String,
        require: "Yêu cầu trường image"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    TopPostSchema: TopPostSchema
}