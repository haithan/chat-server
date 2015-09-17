/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Block = require('./block.model');

exports.register = function(socket) {
  Block.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Block.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('block:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('block:remove', doc);
}