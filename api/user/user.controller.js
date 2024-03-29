'use strict';

var _ = require('lodash');
var User = require('./user.model');

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(users);
  });
};

// Get a single user
exports.show = function(req, res) {
  if (req.params.id) {
    User.findOne({user_id: req.params.id}, function (err, user) {
      if(err) { return handleError(res, err); }
      if(!user) { return res.status(404).send('Not Found'); }
      return res.json(user);
    });
  } else {
    return res.sendStatus(403);
  }
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  if (req.body.user_id) {
    User.findOne({user_id: req.body.user_id}, function (err, user) {
      if (user) { return res.status(403).send('Already exist!'); }
      User.create(req.body, function(err, user) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(user);
      });
    })
  } else {
    return res.status(403).send(req.body);
  }
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if (req.params.id && req.body.name && req.body.avatar_url) {
    User.findOne({user_id: req.params.id}, function (err, user) {
      if (err) { return handleError(res, err); }
      if(!user) {
        User.create({user_id: req.params.id, name: req.body.name, avatar_url: req.body.avatar_url});
        return res.sendStatus(201);
      }
      var updated = _.merge(user, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(user);
      });
    });
  } else {
    res.sendStatus(403);
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}