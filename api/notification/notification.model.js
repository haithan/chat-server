'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  from_user_id: Number,
  to_user_id: Number,
  noti_num: Number
});

module.exports = mongoose.model('Notification', NotificationSchema);