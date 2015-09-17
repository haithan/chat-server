'use strict';

var _ = require('lodash');
var Block = require('./block.model');

// Get list of blocks
// exports.index = function(req, res) {
//   Block.find(function (err, blocks) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(blocks);
//   });
// };

// Get a single block
exports.show = function(req, res) {
  Block.findOne({source_id: req.params.source_id, target_id: req.params.target_id}, function (err, block) {
    if(err) { return handleError(res, err); }
    if(!block) { return res.status(404).send('Not Found'); }
    return res.json(block);
  });
};

// Creates a new block in the DB.
exports.create = function(req, res) {
  Block.create(req.body, function(err, block) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(block);
  });
};

// Updates an existing block in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Block.findOne({source_id: req.params.source_id, target_id: req.params.target_id}, function (err, block) {
    if (err) { return handleError(res, err); }
    if(!block) { return res.status(404).send('Not Found'); }
    var updated = _.merge(block, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(block);
    });
  });
};

// Deletes a block from the DB.
// exports.destroy = function(req, res) {
//   Block.findById(req.params.id, function (err, block) {
//     if(err) { return handleError(res, err); }
//     if(!block) { return res.status(404).send('Not Found'); }
//     block.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}