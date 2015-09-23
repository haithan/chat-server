/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FbInfo = require('./fb_info.model');

exports.register = function(socket) {
  FbInfo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  FbInfo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('fb_info:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('fb_info:remove', doc);
}