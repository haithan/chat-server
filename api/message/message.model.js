'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  session_id: String,
  user_id: Number,
  message: String,
  created_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);