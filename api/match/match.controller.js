'use strict';

var _ = require('lodash');
var Match = require('./match.model');

// Get list of matchs by user_id
exports.show = function(req, res) {
  if (req.user.user_id != req.params.id) {return res.sendStatus(404);}
  Match.find({source_id: req.params.id}, function (err, matchs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(matchs);
  });
};

// Creates a new match in the DB.
exports.create = function(req, res) {
  if (req.body.source_id && req.body.target_id && req.body.session_id) {
    Match.findOne({source_id: req.body.source_id, target_id: req.body.target_id, session_id: req.body.session_id}, function(err, match) {
      if (match) { return res.sendStatus(403); }
      Match.create(req.body, function(err, match) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(match);
      });
    })
  } else {
    return res.sendStatus(403);
  }
};

exports.checkPermission = function(req, res) {
  if (req.user.user_id != req.params.source_id) {return res.sendStatus(404);}
  Match.findOne({source_id: req.params.source_id, target_id: req.params.target_id, session_id: req.params.session_id}, function(err, match) {
    if (err) {return res.sendStatus(403);}
    if (!match) {return res.sendStatus(403);}
    return res.sendStatus(200);
  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}