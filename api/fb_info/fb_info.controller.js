'use strict';

var _ = require('lodash');
var FbInfo = require('./fb_info.model');

exports.index = function(req, res) {
  FbInfo.find(function (err, fb_infos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(fb_infos);
  });
};

// Get list of matchs by user_id
exports.show = function(req, res) {
  if (req.params.id) {
    FbInfo.findOne({fb_uid: req.params.id}, function (err, fb_info) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(fb_info);
    });
  } else {
    return res.sendStatus(403);
  }
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if (req.params.id && req.body.fb_uid) {
    FbInfo.findOne({user_id: req.params.id}, function (err, fb_info) {
      if (err) { return handleError(res, err); }
      if(!fb_info) { return res.status(404).send('Not Found'); }
      var updated = _.merge(fb_info, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(fb_info);
      });
    });
  } else {
    return res.sendStatus(403);
  }
};

// Creates a new fb_info in the DB.
exports.create = function(req, res) {
  if (req.body.fb_uid && req.body.user_id) {
    FbInfo.findOne({user_id: req.body.user_id}, function (err, fb_info) {
      if ( fb_info )  { return res.status(403).send('Already exists!'); }
      FbInfo.create(req.body, function(err, fb_info) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(fb_info);
      });
    })
  } else {
    return res.sendStatus(403);
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}