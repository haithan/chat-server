'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockSchema = new Schema({
  source_id: {type: Number, index: true},
  target_id: {type: Number, index: true},
  block: Boolean
});

module.exports = mongoose.model('Block', BlockSchema);