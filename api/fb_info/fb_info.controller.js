'use strict';

var _ = require('lodash');
var FbInfo = require('./fb_info.model');

// Get list of matchs by user_id
exports.show = function(req, res) {
  FbInfo.findOne({fb_uid: req.params.id}, function (err, fb_info) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(fb_info);
  });
};

// Creates a new fb_info in the DB.
exports.create = function(req, res) {
  FbInfo.create(req.body, function(err, fb_info) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(fb_info);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}