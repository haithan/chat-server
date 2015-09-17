'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DefaultRoomSchema = new Schema({
  user_id: Number,
  room_id: String,
});

module.exports = mongoose.model('DefaultRoom', DefaultRoomSchema);