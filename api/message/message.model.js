'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  session_id: {type: String, index: true},
  user_id: Number,
  message: String,
  deleted: {type: Boolean, default: false},
  created_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);