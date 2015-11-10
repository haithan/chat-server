'use strict';

var _ = require('lodash');
var Message = require('./message.model');
var Match = require('../match/match.model');

// Get messages belong to a room
exports.show = function(req, res) {
  Match.find({source_id: req.user.user_id, session_id: req.params.session_id}, function(err, match) {
    if (err || !match) {return res.sendStatus(404);}
  });

  if (req.params.id === 'undefined') {
    Message.find({session_id: req.params.session_id, deleted: false}, function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(messages);
    }).sort({_id: -1}).limit(25);
  } else {
    Message.find({session_id: req.params.session_id, deleted: false, _id: {$lt: req.params.id}}, function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(messages);
    }).sort({_id: -1}).limit(25);
  }
};

// Creates a new message in the DB.
exports.create = function(req, res) {
  Message.create(req.body, function(err, message) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(message);
  });
};

exports.destroy = function(req, res) {
  Match.find({source_id: req.user.user_id, session_id: req.params.session_id}, function(err, match) {
    if (err || !match) {return res.sendStatus(404);}
  });

  Message.update({session_id: req.params.session_id}, {deleted: true}, { multi: true }, function(err, num) {
    if(err) { return handleError(res, err); }
    return res.status(200).json({num: num});
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}