const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserInfoSchema = new Schema({
    firstname: String,
    lastname: String,
    address: String,
    gender: {
        type: Number
    },
});

var UserAvatarSchema = new Schema({
    imageUrl: {
        type: String,
        required: "Yêu cầu trường imageUrl"
    },
});

var UserSchema = new Schema({
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
        required: "Yêu cầu trường email"
    },
    password: {
        type: String,
        required: "Yêu cầu trường password"
    },
    provinceId: {
        type: Number
    },
    roles: {
        type: Array,
        required: "Yêu cầu trường roles"
    },
    accountType: {
        type: Number,
        required: "Yêu cầu trường accountType"
    },
    info: UserInfoSchema,
    avatar: UserAvatarSchema,
    author: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate:  { type: Date, default: Date.now },
    isDeleted: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
    refreshToken: String
});

module.exports = {
    UserSchema: UserSchema,
    UserInfoSchema: UserInfoSchema
}