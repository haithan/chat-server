'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  from_user_id: {type: Number, index: true},
  to_user_id: {type: Number, index: true},
  noti_num: Number
});

module.exports = mongoose.model('Notification', NotificationSchema);