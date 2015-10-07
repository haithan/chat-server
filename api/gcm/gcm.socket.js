/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gcm = require('./gcm.model');

exports.register = function(socket) {
  Gcm.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gcm.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('gcm:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gcm:remove', doc);
}