'use strict';

var _ = require('lodash');
var Gcm = require('./gcm.model');

// Get a single user
exports.show = function(req, res) {
  Gcm.findOne({user_id: req.params.id}, function (err, gcm) {
    if(err) { return handleError(res, err); }
    if(!gcm) { return res.status(404).send('Not Found'); }
    return res.json(gcm);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gcm.findOne({user_id: req.params.id}, function (err, gcm) {
    if (err) { return handleError(res, err); }

    // if there is no gcm then create it
    if(!gcm) {
      Gcm.create({user_id: req.params.id, gcm_ids: [req.body.gcm_id]}, function(err, gcm) {
        if (err) {return handleError(res, err);}
        return res.status(201).json(gcm)
      })
    } else {
      // check if gcm_id does not exist
      if (gcm.gcm_ids.indexOf(req.body.gcm_id) !== -1) {
        gcm.gcm_ids.push(req.body.gcm_id);
        gcm.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.status(200).json(gcm);
        });
      } else {
        return res.status(200).json(gcm);
      }
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}