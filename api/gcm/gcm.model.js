'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GcmSchema = new Schema({
  user_id: Number,
  gcm_ids: [String],
});

module.exports = mongoose.model('Gcm', GcmSchema);