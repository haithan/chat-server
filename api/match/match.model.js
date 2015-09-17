'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
  source_id: Number,
  target_id: Number,
  session_id: String
});

module.exports = mongoose.model('Match', MatchSchema);