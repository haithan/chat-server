'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FbInfoSchema = new Schema({
  fb_uid: {type: String, index: true},
  user_id: {type: Number, index: true}
});

module.exports = mongoose.model('FbInfo', FbInfoSchema);