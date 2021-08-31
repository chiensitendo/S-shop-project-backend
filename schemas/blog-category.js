const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogCategoriesSchema = new Schema({
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
    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        require: "Yêu cầu trường name"
    }
});

module.exports = {
    BlogCategoriesSchema: BlogCategoriesSchema
}