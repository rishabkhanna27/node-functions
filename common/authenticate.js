const jwt = require("jsonwebtoken");
const Model = require("../models");
const Handlebars = require("handlebars");
var config = require('config')

module.exports.getToken = (data) =>
  jwt.sign(data, config.get('JWT_SERVICE.SECRET_KEY'), {
    expiresIn: "30 days"
  });
module.exports.getVerifyToken = (data) =>
  jwt.sign(data, config.JWT_SERVICE.SECRET_KEY, {
    expiresIn: "2h"
});
module.exports.verifyToken = (token) =>
  jwt.verify(token, config.get('JWT_SERVICE.SECRET_KEY'));

module.exports.verify = (...args) => async (req, res, next) => {
  try {
    const roles = [].concat(args).map((role) => role.toLowerCase());
    const token = String(req.headers.authorization || "")
      .replace(/bearer|jwt/i, "")
      .replace(/^\s+|\s+$/g, "");
    let decoded;
    if (token) decoded = this.verifyToken(token);
    let doc = null;
    let role = "";
    if (!decoded && roles.includes("guest")) {
      role = "guest";
      return next();
    }
    if (decoded != null && roles.includes("user")) {
      role = "user";
      doc = await Model.User.findOne({
        _id: decoded._id,
        jtiKey: decoded.jtiKey,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (decoded != null && roles.includes("admin")) {
      role = "admin";
      doc = await Model.Admin.findOne({
        _id: decoded._id,
        jtiKey: decoded.jtiKey,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (!doc) {
      return res.send({
        "statusCode": 401,
        "message": "Session expired!",
        "data": {},
        "status": 0,
        "isSessionExpired": true
      })
    };
    if (role) req[role] = doc.toJSON();
    next();
  } catch (error) {
    console.error(error);
    const message =
      String(error.name).toLowerCase() === "error" ?
      error.message :
      "Unauthorized Access!";
    return res.error(401, message);
  }
};
