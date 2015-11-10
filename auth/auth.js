'use strict';

var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../api/user/user.model');

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

function requestFromRailsServer(req, res, cb) {
  var ip = req.ip.split("f:")[1];
  if (ip === config.rails_ip || ip === '127.0.0.1') {
    cb(req, res);
  } else {
    res.sendStatus(500);
  }
}

exports.findUserByJWT = findUserByJWT;
exports.authenticateWeb = authenticateWeb;
exports.requestFromRailsServer = requestFromRailsServer;
