const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var otpModel = new Schema({
    email: {
        type: String,
        lowercase: true,
        default: ""
    },
    dialCode: {
        type: String,
        default: ""
    },
    phoneNo: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

module.exports = mongoose.model('otp', otpModel);