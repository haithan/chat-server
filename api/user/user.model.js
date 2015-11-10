'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  user_id: {type: Number, index: true},
  name: String,
  avatar_url: String,
});

module.exports = mongoose.model('User', UserSchema);