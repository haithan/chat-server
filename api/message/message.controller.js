'use strict';

var _ = require('lodash');
var Message = require('./message.model');

// Get messages belong to a room
exports.show = function(req, res) {
  if (req.params.id === 'undefined') {
    Message.find({session_id: req.params.session_id, deleted: false}, function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(messages);
    }).sort({_id: -1}).limit(20);
  } else {
    Message.find({session_id: req.params.session_id, deleted: false, _id: {$lt: req.params.id}}, function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(messages);
    }).sort({_id: -1}).limit(20);
  }
};

exports.showAll = function(req,res) {
  Message.find({session_id: req.params.session_id, deleted: false}, function (err, messages) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(messages);
  });
}

// Creates a new message in the DB.
exports.create = function(req, res) {
  Message.create(req.body, function(err, message) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(message);
  });
};

exports.destroy = function(req, res) {
  Message.update({session_id: req.params.session_id}, {deleted: true}, { multi: true }, function(err, num) {
    if(err) { return handleError(res, err); }
    return res.status(200).json({num: num});
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}