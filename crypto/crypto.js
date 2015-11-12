'use strict';

var CryptoJS = require('crypto-js');
var pass = 'mmj@#172014';

exports.encrypt = function(text) {
  var enc = CryptoJS.AES.encrypt(text, pass).toString();

  return enc;
};

exports.decrypt = function(text) {
  var dec = CryptoJS.AES.decrypt(text, pass);
  dec = dec.toString(CryptoJS.enc.Utf8);

  return dec;
}

