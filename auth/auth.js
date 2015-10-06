'use strict';

var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../api/user/user.model');

function authenticateWeb(cookies, callback) {
  if ((cookies.x_user === undefined) || (cookies.x_user == '')) {
    callback(false);
    return;
  }

  var myCookie = jwt.verify(cookies.x_user, config.secret_key);
  //TODO: check expired date of cookies
  User.findOne({user_id: myCookie.user}, function (err, user) {
    if ((err) || (!user)) {
      callback(false);
      return;
    }
    callback(user.user_id);
  })
}

exports.authenticateWeb = authenticateWeb;