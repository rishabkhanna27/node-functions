const path = require("path");
const mongoose = require("mongoose");
const FCM = require('fcm-node');
const Model = require('../models/index');
const constants = require("../common/constants");
const apn = require("apn");

var config = require('config')
// const apnProvider = new apn.Provider({
//   token: {
//     key: path.join(__dirname, ''),
//     keyId: config.get('apnKey.keyId'),
//     teamId: config.('apnKey.teamId')
//   },
//   production: false,
// });
exports.sendAndroidPushNotifiction = sendAndroidPushNotifiction;
exports.sendIosPushNotification = sendIosPushNotification;
exports.preparePushNotifiction = preparePushNotifiction;
exports.sendWebPushNotifiction = sendWebPushNotifiction;
exports.sendPushNotifictionAccordingToDevice = sendPushNotifictionAccordingToDevice;

async function sendAndroidPushNotifiction(payload) {
  let fcm = new FCM(config.get('fcmKey.android'));
  var message = {
    to: payload.deviceToken || '',
    collapse_key: '',
    data: payload
  };
  if (payload.isAdminNotification && payload.isNotificationSave) {
    new Model.AdminNotification(payload).save();
  }
  if (payload.isUserNotification && payload.isNotificationSave) {
    new Model.UserNotification(payload).save();
  }
  fcm.send(message, (err, response) => {
    if (err) {
      console.log('Something has gone wrong!', err);
    } else {
      console.log('Push successfully sent!');
    }
  });
}
async function sendIosPushNotification(payload) {
  try {
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = "ping.aiff";
    note.badge = 3;
    note.alert = {
      title: payload.title,
      body: payload.message
    };
    note.topic = config.get('apnKey.bundleId') 
    note.payload = payload;
    const result = await apnProvider.send(note, payload.deviceToken)
    console.log(result, "result");
    result.sent.forEach(token => {
      console.log("Notification sent to " + token)
    })
    result.failed.forEach(failure => {
      if (failure.error) {
        console.log("Error : " + failure.error.message)
      } else {
        console.log("Failure Status : " + failure.status)
        console.log("Failure response : " + failure.response.reason)
        console.log("Failure device : " + failure.device)
      }
    })

    if (payload.isAdminNotification && payload.isNotificationSave) {
      new Model.AdminNotification(payload).save();
    }
    if (payload.isUserNotification && payload.isNotificationSave) {
      new Model.UserNotification(payload).save();
    }
  } catch (error) {
    console.log(error, "error")
  }
}
async function sendWebPushNotifiction(payload) {

  if (payload.isDriverNotification && payload.isNotificationSave) {
    new Model.DriverNotificationModel(payload).save();
  }
  if (payload.isResturantNotification && payload.isNotificationSave) {
    new Model.ResturantNotificationModel(payload).save();
  }
  if (payload.isAdminNotification && payload.isNotificationSave) {
    new Model.AdminNotificationModel(payload).save();
  }
  fcm.send(message, (err, response) => {
    if (err) {
      console.log('Something has gone wrong!', err);
    } else {
      console.log('Push successfully sent!');
    }
  });
}
async function saveNotifiction(payload) {
  if (payload.isAdminNotification && payload.isNotificationSave) {
    new Model.AdminNotification(payload).save();
  }
  if (payload.isUserNotification && payload.isNotificationSave) {
    new Model.UserNotification(payload).save();
  }
}
async function sendPushNotifictionAccordingToDevice(deviceData, payload) {
  let deviceToken = deviceData.deviceToken;
  let deviceType = deviceData.deviceType;
  payload.deviceToken = deviceToken;
  switch (deviceType) {
    case "ANDROID":
      sendAndroidPushNotifiction(payload);
      break;
    case "IOS":
      sendIosPushNotification(payload);
      break;
    case "WEB":
      sendWebPushNotifiction(payload);
      break;
    case "BROAD":
      send_fcm_notifications(payload);
      break;
    default:
      console.log('Invalid device type');
      break;
  }
  return true;
}
async function preparePushNotifiction(payloadData, userType) {
  let payload = JSON.parse(JSON.stringify(payloadData));
  if (payload && payload.data)
    delete payload.data;
  if (payload && payload.keys)
    delete payload.keys;
  if (userType == constants.PUSHROLE.ADMIN) {
    saveNotifiction(payload)
  } else if (userType == constants.PUSHROLE.USER) {
    const deviceData = await Model.User.findOne({
      _id: payload.userId
    })
    if (deviceData) {
      sendPushNotifictionAccordingToDevice(deviceData, payload);
    } else {
      console.log('No user device data found.')
    }
  } else if (userType == constants.PUSHROLE.BROADCAST) {
      deviceData = {}
      deviceData.deviceType = "BROAD"
      deviceData.deviceToken = ""
      sendPushNotifictionAccordingToDevice(deviceData, payload);
  }
}
async function send_fcm_notifications(payload) {
  var notification = payload
  let token = []
  let tokenIos = []
  let userIds = await Model.User.find({
    isDeleted: false,
    deviceToken: {
      $nin: [null, ""]
    }
  }, {
    deviceToken: 1,
    deviceType: 1,
    _id: 0
  })
  console.log(userIds.length)
  for (let i = 0; i < userIds.length; i++) {
    if (userIds[i] != null) {
      if (userIds[i].deviceType == "ANDROID") {
        token.push(JSON.parse(JSON.stringify(userIds[i].deviceToken)))
      }
      if (userIds[i].deviceType == "IOS") {
        tokenIos.push(JSON.parse(JSON.stringify(userIds[i].deviceToken)))
      }
    }
  }
  let size = 800
  let tokenData = [];
  let tokenDataIos = [];
  for (let i = 0; i < size - 1; i++) {
    if(token.slice(0, size).length > 0){
      tokenData.push(token.slice(0, size));
      token.splice(0, size);
    }
    if(tokenIos.slice(0, size).length > 0){
      tokenDataIos.push(tokenIos.slice(0, size));
      tokenIos.splice(0, size);
    }
  }
  for(let i = 0 ; i < tokenData.length ; i ++){
    var fcm_tokens = tokenData[i]
    var notification_body = {
      'data': notification,
      'registration_ids': fcm_tokens
    }
  
    fetch('https://fcm.googleapis.com/fcm/send', {
      'method': 'POST',
      'headers': {
        // replace authorization key with your key
        'Authorization': 'key=' + `${process.env.fcmKey}`,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(notification_body)
    }).catch(function (error) {
      console.error(error);
    })
  }
  for(let i = 0 ; i < tokenDataIos.length ; i ++){
    var fcm_tokens = tokenDataIos[i]

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = "ping.aiff";
    note.badge = 3;
    note.alert = {
      title: payload.title,
      body: payload.message
    };
    note.topic = process.env.apn_budleId
    note.payload = payload;

    const result = await apnProvider.send(note, fcm_tokens).catch(function (error) {
      console.error(error);
    })
  }
}