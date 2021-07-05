const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitSchema = new Schema({
    id: {
        type: Number,
        required: "Yêu cầu trường id"
    },
    times: {
        type: Number,
        default: 0
    },
});

module.exports = {
    VisitSchema: VisitSchema
}