'use strict';

var _ = require('lodash');
var Message = require('./message.model');

// Get list of messages
// exports.index = function(req, res) {
//   Message.find(function (err, messages) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(messages);
//   });
// };

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

// Updates an existing message in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Message.findById(req.params.id, function (err, message) {
//     if (err) { return handleError(res, err); }
//     if(!message) { return res.status(404).send('Not Found'); }
//     var updated = _.merge(message, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(message);
//     });
//   });
// };

// Deletes a message from the DB.
// exports.destroy = function(req, res) {
//   Message.findById(req.params.id, function (err, message) {
//     if(err) { return handleError(res, err); }
//     if(!message) { return res.status(404).send('Not Found'); }
//     message.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}