'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FbInfoSchema = new Schema({
  fb_uid: String,
  user_id: Number
});

module.exports = mongoose.model('FbInfo', FbInfoSchema);