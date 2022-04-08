const config = require('config')
// const client = require('twilio')(config.get('twillioCredentials.accountSid'), config.get('twillioCredentials.authToken'), {
//     lazyLoading: true
// });
const fromNumber = config.get('twillioCredentials.fromNumber');
const constants = require('../common/constants')
const functions = require('../common/functions')
const Model = require('../models/index')
const moment = require('moment')

const sendSMSTwillo = async (dialCode, phoneNo, message) => {
    return new Promise((resolve, reject) => {
        const smsOptions = {
            from: fromNumber,
            to: "+" + dialCode + (phoneNo ? phoneNo.toString() : ''),
            body: message,
        };
        client.messages.create(smsOptions).then(message => console.log(message.sid)).catch(err => console.log(err));
    });
};

const sendSMS = async (dialCode, phoneNo, message) => {
    return new Promise((resolve, reject) => {
        console.log("sms send ", dialCode, phoneNo, message)
        sendSMSTwillo(dialCode, phoneNo, message);
        return resolve(message);
    });
};

//Verification 

exports.sendPhoneVerification = async (payload) => {
    try {
        if (!payload.dialCode) throw new Error(constants.MESSAGES.DIAL_CODE_MISSING);
        if (!payload.phoneNo) throw new Error(constants.MESSAGES.PHONE_MISSING);
        // let otp = functions.generateNumber(4)
        let otp = "1234"

        let dataToSave = {
            dialCode : payload.dialCode,
            phoneNo : payload.phoneNo,
            otp : otp
        }
        await Model.OtpModel.deleteMany({
            dialCode : payload.dialCode,
            phoneNo : payload.phoneNo
        })
        await Model.OtpModel(dataToSave).save()
        let payloadData = {
            phoneNo: payload.phoneNo,
            dialCode: payload.dialCode,
            message: `Your verification code for strutoo is ${otp}`
        }
        console.log("OTP----------------->",payloadData.message,"<------------------")
        // await sendSMS(payloadData.dialCode, payloadData.phoneNo, payloadData.message);
    } catch (error) {
        console.error("sendPhoneVerification", error);
    }
};