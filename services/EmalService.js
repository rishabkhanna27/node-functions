const config = require('config')
const nodemailer = require("nodemailer");

const constants = require('../common/constants')
const Model = require('../models/index')
const functions = require('../common/functions')
const moment = require('moment')

module.exports.send = async (payload) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get('mailer.EMAIL_HOST'),
      port: config.get('mailer.EMAIL_PORT'),
      secure: config.get('mailer.EMAIL_PORT'),
      auth: {
        user: config.get('mailer.EMAIL_USER'),
        pass: config.get('mailer.EMAIL_PASS')
      },
    });
    const info = await transporter.sendMail({
      from: '"Cure" <admin@getcure.app>',
      to: [].concat(payload.to),
      subject: `${payload.title}`,
      text: `${payload.message}`.replace(/\<\/?br\/?\>/g, "\n").replace(/\<[^\>]+\>/g, ""),
      html: `${payload.message}`,
    });
    console.log("EmailService", info);
  } catch (error) {
    console.error("EmailService", error);
  }
};

//Verification

exports.sendEmailVerification = async (payload) => {
  try {
    if (!payload.email) throw new Error(constants.MESSAGES.EMAIL_MISSING);
    // let otp = functions.generateNumber(4)
    let otp = "1234"
    let payloadData = {
      to: payload.email,
      title: "Verify your account",
      message: `<html>

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
          <!-- font files -->
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
          <!-- Latest compiled and minified CSS -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
          <link rel="icon" type="image/x-icon" href="images/favicon.ico">
          <style>
          @media(max-width:600px){
          .main-w{
          width:90%!important;
          }
          figure{
              margin: 12px auto !important;
          }
          img{
          width:122px;
          }
          h1{
          font-size:22px !important;text-align:center;margin:0px !important;
          }
          .verfiy{
              margin: 4px 0 25px !important;font-size:16px !important;text-align:center;
          }
          .code{
      
          padding: 10px 21px !important;
          font-size: 25px !important;
          }
          }
          
          
          </style>
      </head>
      
      <body>
          <div class="nunutemplate" style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
              <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                  padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                  <tbody>
                      <tr class="flex" style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                          <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                              <figure style="margin: 20px auto;">
                              <img src="https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_f0b606abb6d19089febc9faeeba5bc05/nodejs-development-services.png" style="width: 200px;" alt="logo"></figure>
                          </td>
                      </tr>
                      <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                          <td style="width: 100%;display: block;">
                              <table style="width:100%;">
                                  <tr>
                                      <td style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                          <h1 style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 34px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;">Verify your Email Address</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="color: #000; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy">To verify your email address, please use the below link.
                                      </td>
                                  </tr>
                                  <tr>
                                      <td >
                                      <p style="width: 100%; background: #2A9D8F; border: none; color: #fff; padding: 10px 10px 10px 10px; text-align: center; font-size: 32px; font-weight: 600; letter-spacing: 29px;" class="code">${otp}</p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      
      </html>`,
    };
    await Model.otp.deleteMany({
      email: payload.email.toLowerCase(),
    });

    let data = {
      email: payload.email.toLowerCase(),
      otp: otp
    }

    await Model.OtpModel(data).save();

    await this.send(payloadData)
  } catch (error) {
    console.error("sendEmailVerification", error);
  }
};

exports.sendLoginCred = async (payload) => {
  try {
    // if (!payload.userId) throw new Error(constants.MESSAGES.USER_DATA_MISSING);
    if (!payload.email) throw new Error(constants.MESSAGES.EMAIL_MISSING);
    if (!payload.password) throw new Error(constants.MESSAGES.EMAIL_MISSING);
    let payloadData
    console.log(payload,"in email")
    if (payload.type == 1) {
      payloadData = {
        to: payload.email,
        title: "Driver Login Credentials",
        message: `<html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
            <!-- font files -->
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
            <link rel="icon" type="image/x-icon" href="images/favicon.ico">
            <style>
            @media(max-width:600px){
            .main-w{
            width:90%!important;
            }
            figure{
                margin: 12px auto !important;
            }
            img{
            width:122px;
            }
            h1{
            font-size:22px !important;text-align:center;margin:0px !important;
            }
            .verfiy{
                margin: 4px 0 25px !important;font-size:16px !important;text-align:center;
            }
            .code{
        
            padding: 10px 21px !important;
            font-size: 25px !important;
            }
            }
            
            
            </style>
        </head>
        
        <body>
            <div class="nunutemplate" style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
                <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                    padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                    <tbody>
                        <tr class="flex" style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                            <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                                <figure style="margin: 20px auto;">
                                <img src="https://preppablo.s3.amazonaws.com/1642605249214logo.png" style="width: 200px;" alt="logo"></figure>
                            </td>
                        </tr>
                        <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                            <td style="width: 100%;display: block;">
                                <table style="width:100%;">
                                    <tr>
                                        <td style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                            <h1 style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 34px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;">Login Credentials</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #000; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy">New Account has been created.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #000; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy">Login Credentials for your account <br><b>Email : ${payload.email}</b></br><br><b>Password : ${payload.password}</b></br>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>`
      };
    }
    if (payload.type == 2) {
      payloadData = {
        to: payload.email,
        title: "Pharmacy Login Credentials",
        message: `<html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
            <!-- font files -->
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
            <link rel="icon" type="image/x-icon" href="images/favicon.ico">
            <style>
            @media(max-width:600px){
            .main-w{
            width:90%!important;
            }
            figure{
                margin: 12px auto !important;
            }
            img{
            width:122px;
            }
            h1{
            font-size:22px !important;text-align:center;margin:0px !important;
            }
            .verfiy{
                margin: 4px 0 25px !important;font-size:16px !important;text-align:center;
            }
            .code{
        
            padding: 10px 21px !important;
            font-size: 25px !important;
            }
            }
            </style>
        </head>
        
        <body>
            <div class="nunutemplate" style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
                <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                    padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                    <tbody>
                        <tr class="flex" style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                            <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                                <figure style="margin: 20px auto;">
                                <img src="https://preppablo.s3.amazonaws.com/1642605249214logo.png" style="width: 200px;" alt="logo"></figure>
                            </td>
                        </tr>
                        <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                            <td style="width: 100%;display: block;">
                                <table style="width:100%;">
                                    <tr>
                                        <td style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                            <h1 style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 34px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;color: #264653;font-weight: 600;">Herzlich Willkommen! </h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #525252; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 2px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy">Für Ihre Apotheke wurde erfolgreich ein Account erstellt.
                                        </td>
                                        <td style="color: #525252; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center; " class="verfiy"> Sie können sich unter folgender Website anmelden.</a></td>
                                    </tr>
                                    <tr><td style="color: #264653;
                                        font-size: 22px;
                                        font-weight: 600;
                                        font-family: 'Poppins', sans-serif;
                                        width: 100%;
                                        display: inline-block;
                                        vertical-align: middle;
                                        text-align: center;
                                        padding: 10px 0;">Ihre Login Daten lauten: </td></tr>
                        
                                    <tr>
                                        <td style="color: #525252; font-size: 16px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center; padding: 10px 0;" class="verfiy"><b>Email: ${payload.email}</b></br><br><b>Passwort : ${payload.password}</b></br><br><b>Dashboard Passwort: ${payload.dashboardPass}</b></br><br><b>Website Link : <a>https://pharmacy.getcure.app/</a></br>.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="    font-size: 18px;
                                            line-height: normal;
                                            font-weight: 500;color: #525252;">Mit freundlichen Grüßen</p>
                                            <h5 style="font-size: 16px;
                                            font-weight: 800;color: #264653;">CURE Team</h5>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>`
      };
    }
    await this.send(payloadData)
  } catch (error) {
    console.error("sendEmailVerification", error);
  }
};

exports.sendBroadCastingEmail = async (payload) => {
  try {
    if (!payload.message) throw new Error(constants.MESSAGES.MESSAGE_BODY_MISSING)
    if (!payload.title) throw new Error(constants.MESSAGES.MESSAGE_TITLE_MISSING)
    const users = await Model.User.find({
      isDeleted: false,
      isBlocked: false
    })
    for (let i = 0; i < users.length; i++) {
      let payloadData = {
        to: users[i].email,
        title: payload.title,
        message: payload.message,
      };
      // await this.send(payloadData)
    }
  } catch (error) {
    console.error("sendBroadCastingEmail", error);
  }
};

exports.adminForgetPassword = async (payload) => {
  try {
    if (!payload.email) throw new Error(constants.MESSAGES.EMAIL_MISSING)
    const adminData = await Model.Admin.findOne({
      isDeleted: false,
      email: payload.email
    }).lean()
    if (adminData == null) throw new Error(constants.MESSAGES.ADMIN_NOT_FOUND)
    const password = functions.generateRandomStringAndNumbers(8)
    await adminData.setPassword(password)
    let payloadData = {
      to: adminData.email,
      title: "Reset Paswword",
      message: `Please, use this one time password to reset your password ${password}`
    };
    // await this.send(payloadData)
    adminData.save()
  } catch (error) {
    console.error("sendEmailVerification", error);
  }
};

exports.sendEmailLink = async (payload) => {
  try {
    if (!payload.link) throw new Error(constants.MESSAGES.USER_DATA_MISSING);
    if (!payload.email) throw new Error(constants.MESSAGES.EMAIL_MISSING);
    let payloadd = {
      _ok: "Forgot Password Link Sent",
      to: payload.email,
      title: "Reset your account password",
      message:  `<html>

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
          <!-- font files -->
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
          <!-- Latest compiled and minified CSS -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
          <link rel="icon" type="image/x-icon" href="images/favicon.ico">
          <style>
          @media(max-width:600px){
          .main-w{
          width:90%!important;
          }
          figure{
              margin: 12px auto !important;
          }
          img{
          width:122px;
          }
          h1{
          font-size:22px !important;text-align:center;margin:0px !important;
          }
          .verfiy{
              margin: 4px 0 25px !important;font-size:16px !important;text-align:center;
          }
          .code{
      
          padding: 10px 21px !important;
          font-size: 25px !important;
          }
          }
          
          
          </style>
      </head>
      
      <body>
          <div class="nunutemplate" style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
              <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                  padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                  <tbody>
                      <tr class="flex" style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                          <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                              <figure style="margin: 20px auto;">
                              <img src="https://preppablo.s3.amazonaws.com/1642605249214logo.png" style="width: 200px;" alt="logo"></figure>
                          </td>
                      </tr>
                      <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                          <td style="width: 100%;display: block;">
                              <table style="width:100%;">
                                  <tr>
                                      <td style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                          <h1 style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 34px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;">Reset Account Password</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="color: #000; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy">To reset your password, please use the below link.
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="color: #000; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;" class="verfiy"><a href="${payload.link}">${payload.link}</a>.
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      
      </html>`
    };

    await this.send(payloadd)
  } catch (error) {
    console.error("sendEmailVerification", error);
  }
};

exports.sendOrderUpdate = async (payload) => {
  try {
    // if (!payload.userId) throw new Error(constants.MESSAGES.USER_DATA_MISSING);
    if (!payload.email) throw new Error(constants.MESSAGES.PARAMATERS_MISSING);
    if (!payload.orderNo) throw new Error(constants.MESSAGES.PARAMATERS_MISSING);
    if (!payload.name) throw new Error(constants.MESSAGES.PARAMATERS_MISSING);
    let payloadData
    console.log(payload,"in email")
    if(payload.type == 1){
      payloadData = {
        to: payload.email,
        title: "You got a new order",
        message: 
        `<html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
            <!-- font files -->
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
            <link rel="icon" type="image/x-icon" href="images/favicon.ico">
            <style>
                @media(max-width:600px) {
                    .main-w {
                        width: 90% !important;
                    }
        
                    figure {
                        margin: 12px auto !important;
                    }
        
                    img {
                        width: 122px;
                    }
        
                    h1 {
                        font-size: 22px !important;
                        text-align: center;
                        margin: 0px !important;
                    }
        
                    .verfiy {
                        margin: 4px 0 25px !important;
                        font-size: 16px !important;
                        text-align: center;
                    }
        
                    .code {
        
                        padding: 10px 21px !important;
                        font-size: 25px !important;
                    }
                }
            </style>
        </head>
        
        <body>
            <div class="nunutemplate"
                style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
                <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                            padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                    <tbody>
                        <tr class="flex"
                            style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                            <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                                <figure style="margin: 20px auto;">
                                    <img src="https://preppablo.s3.amazonaws.com/1642605249214logo.png" style="width: 200px;"
                                        alt="logo"></figure>
                            </td>
                        </tr>
                        <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                            <td style="width: 100%;display: block;">
                                <table style="width:100%;">
                                    <tr>
                                        <td
                                            style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                            <h1
                                                style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 34px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;color: #264653;font-weight: 600;">
                                                You Got A New Order! </h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #525252; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 2px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;"
                                            class="verfiy">A new Order has been placed with your pharmacy.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #264653;
                                                font-size: 22px;
                                                font-weight: 600;
                                                font-family: 'Poppins', sans-serif;
                                                width: 100%;
                                                display: inline-block;
                                                vertical-align: middle;
                                                text-align: center;
                                                padding: 10px 0;">Here are the following order details: </td>
                                    </tr>
        
                                    <tr>
                                        <td style="color: #525252; font-size: 16px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center; padding: 10px 0;"
                                            class="verfiy"><b>Order No: ${payload.orderNo}</b></br><br><b>User Name :
                                                ${payload.name}</b></br><br><b>Website Link :
                                                <a>https://pharmacy.getcure.app/pages/dashboard</a></br>.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="    font-size: 18px;
                                                    line-height: normal;
                                                    font-weight: 500;color: #525252;">Mit freundlichen Grüßen</p>
                                            <h5 style="font-size: 16px;
                                                    font-weight: 800;color: #264653;">CURE Team</h5>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>`
      };
    }
    if(payload.type == 2){
      payloadData = {
        to: payload.email,
        title: "An Order has been cancelled",
        message: 
        `<html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
            <!-- font files -->
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
            <link rel="icon" type="image/x-icon" href="images/favicon.ico">
            <style>
                @media(max-width:600px) {
                    .main-w {
                        width: 90% !important;
                    }
        
                    figure {
                        margin: 12px auto !important;
                    }
        
                    img {
                        width: 122px;
                    }
        
                    h1 {
                        font-size: 22px !important;
                        text-align: center;
                        margin: 0px !important;
                    }
        
                    .verfiy {
                        margin: 4px 0 25px !important;
                        font-size: 16px !important;
                        text-align: center;
                    }
        
                    .code {
        
                        padding: 10px 21px !important;
                        font-size: 25px !important;
                    }
                }
            </style>
        </head>
        
        <body>
            <div class="nunutemplate"
                style="background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; padding: 40px 0;">
                <table class="main-w" align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto; width:550px;background: #fff; display: flex; justify-content: center; align-items: center; 
                            padding:20px 40px 40px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);">
                    <tbody>
                        <tr class="flex"
                            style="width: 100%;border-bottom: 1px solid #ddd;display: inline-block;vertical-align: middle;text-align: center;">
                            <td style=" width: 100%;display: inline-block;vertical-align: middle;">
                                <figure style="margin: 20px auto;">
                                    <img src="https://preppablo.s3.amazonaws.com/1642605249214logo.png" style="width: 200px;"
                                        alt="logo"></figure>
                            </td>
                        </tr>
                        <tr style="width: 100%;display: inline-block;vertical-align: middle;">
                            <td style="width: 100%;display: block;">
                                <table style="width:100%;">
                                    <tr>
                                        <td
                                            style="text-align: center;font-size: 16px;font-weight: 600;margin-top: 1rem;display: block;letter-spacing: 3px;">
                                            <h1
                                                style="font-family: 'Montserrat', sans-serif; text-align: left; font-size: 26px; line-height: 47px; letter-spacing: 0;  font-family: 'Montserrat', sans-serif;text-align: center;color: #cc6122;font-weight: 900;">
                                                An Order Has Been Cancelled! </h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #525252; font-size: 17px; font-family: 'Poppins', sans-serif; margin: 0px 0 2px; width: 100%; display: inline-block; vertical-align: middle;text-align: center;"
                                            class="verfiy">Order has been cancelled by Admin.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #264653;
                                                font-size: 22px;
                                                font-weight: 600;
                                                font-family: 'Poppins', sans-serif;
                                                width: 100%;
                                                display: inline-block;
                                                vertical-align: middle;
                                                text-align: center;
                                                padding: 10px 0;">Here are the following order details: </td>
                                    </tr>
        
                                    <tr>
                                        <td style="color: #525252; font-size: 16px; font-family: 'Poppins', sans-serif; margin: 0px 0 25px; width: 100%; display: inline-block; vertical-align: middle;text-align: center; padding: 10px 0;"
                                            class="verfiy"><b>Order No: ${payload.orderNo}</b></br><br><b>User Name :
                                                ${payload.name}</b></br><br><b>Website Link :
                                                <i><a>https://pharmacy.getcure.app/pages/dashboard</a></i></br>.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="    font-size: 18px;
                                                    line-height: normal;
                                                    font-weight: 500;color: #525252;">Mit freundlichen Grüßen</p>
                                            <h5 style="font-size: 16px;
                                                    font-weight: 800;color: #264653;">CURE Team</h5>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>`
      };
    }
    
    await this.send(payloadData)
  } catch (error) {
    console.error("sendEmailVerification", error);
  }
};