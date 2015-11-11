'use strict';

var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../api/user/user.model');
var FbInfo = require('../api/fb_info/fb_info.model');

function requestFromRailsServer(req, res, cb) {
  var ip = req.ip.split("f:")[1];
  if (ip === config.rails_ip || ip === '127.0.0.1') {
    cb(req, res);
  } else {
    res.sendStatus(500);
  }
};

function createAuthToken(id) {
  var payload = {user: id};
  var token = jwt.sign(payload, config.secret_key);
  return token;
};

function findUserByJWT(token, callback) {
  var credentials = jwt.verify(token, config.secret_key);

  User.findOne({user_id: credentials.user}, function (err, user) {
    if (err) {return callback(err)};
    if (!user) {return callback(null, false);}
    return callback(null, user)
  })
};

function authenticateWeb(cookies, callback) {
  if ((cookies.x_user === undefined) || (cookies.x_user == '')) {
    callback(null, false);
    return;
  }

  findUserByJWT(cookies.x_user, callback);
};

function authMobile(uid, callback) {
  FbInfo.findOne({fb_uid: uid}, function (err, fbInfo) {
    return callback(err, fbInfo);
  })
};

exports.findUserByJWT = findUserByJWT;
exports.authenticateWeb = authenticateWeb;
exports.requestFromRailsServer = requestFromRailsServer;
exports.authMobile = authMobile;
exports.createAuthToken = createAuthToken;
