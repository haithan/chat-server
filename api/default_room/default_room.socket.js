/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DefaultRoom = require('./default_room.model');

exports.register = function(socket) {
  DefaultRoom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DefaultRoom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('default_room:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('default_room:remove', doc);
}