'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  user_id: Number,
  name: String,
  avatar_url: String,
  fb_uid: String
});

module.exports = mongoose.model('User', UserSchema);