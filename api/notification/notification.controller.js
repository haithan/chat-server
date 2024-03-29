'use strict';

var _ = require('lodash');
var Notification = require('./notification.model');

// Get list of notifications
exports.index = function(req, res) {
  if (req.user.user_id != req.params.to_user_id) {return res.sendStatus(404);}
  Notification.find({to_user_id: req.params.to_user_id}, function (err, notifications) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(notifications);
  });
};

// Get a single notification
exports.show = function(req, res) {
  if (req.user.user_id != req.params.source_id) {return res.sendStatus(404);}
  Notification.findOne({from_user_id: req.params.from_user_id, to_user_id: req.params.to_user_id}, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.status(404).send('Not Found'); }
    return res.json(notification);
  });
};

// Creates a new notification in the DB.
exports.create = function(req, res) {
  if (req.user.user_id != req.body.from_user_id) {return res.sendStatus(404);}
  Notification.create(req.body, function(err, notification) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(notification);
  });
};

// Updates an existing notification in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if (req.user.user_id != req.params.from_user_id && req.user.user_id != req.params.to_user_id) {return res.sendStatus(404);}
  Notification.findOne({from_user_id: req.params.from_user_id, to_user_id: req.params.to_user_id}, function (err, notification) {
    if (err) { return handleError(res, err); }
    if(!notification) { return res.status(404).send('Not Found'); }
    var updated = _.merge(notification, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(notification);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}