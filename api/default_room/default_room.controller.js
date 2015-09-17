'use strict';

var _ = require('lodash');
var DefaultRoom = require('./default_room.model');

// Get list of default_rooms
// exports.index = function(req, res) {
//   DefaultRoom.find(function (err, default_rooms) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(default_rooms);
//   });
// };

// Get a single default_room
exports.show = function(req, res) {
  DefaultRoom.findOne({user_id: req.params.user_id}, function (err, default_room) {
    if(err) { return handleError(res, err); }
    if(!default_room) { return res.status(404).send('Not Found'); }
    return res.json(default_room);
  });
};

// Creates a new default_room in the DB.
exports.create = function(req, res) {
  DefaultRoom.create(req.body, function(err, default_room) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(default_room);
  });
};

// Updates an existing default_room in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DefaultRoom.findOne({user_id: req.params.user_id}, function (err, default_room) {
    if (err) { return handleError(res, err); }
    if(!default_room) { return res.status(404).send('Not Found'); }
    var updated = _.merge(default_room, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(default_room);
    });
  });
};

// Deletes a default_room from the DB.
// exports.destroy = function(req, res) {
//   DefaultRoom.findById(req.params.id, function (err, default_room) {
//     if(err) { return handleError(res, err); }
//     if(!default_room) { return res.status(404).send('Not Found'); }
//     default_room.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}