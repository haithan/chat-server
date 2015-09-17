'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockSchema = new Schema({
  source_id: Number,
  target_id: Number,
  block: Boolean
});

module.exports = mongoose.model('Block', BlockSchema);