/**
 * Socket.io configuration
 */

'use strict';

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/match/match.socket').register(socket);
  require('../api/user/user.socket').register(socket);
  require('../api/block/block.socket').register(socket);
  require('../api/notification/notification.socket').register(socket);
  require('../api/default_room/default_room.socket').register(socket);
  require('../api/message/message.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.set('origins', '*:*');

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    socket.on('addUser', function(data) {
      // leave previous room
      if (socket.room) {
        socket.leave(socket.room);
      }
      socket.room = data.room;
      socket.userId = data.userId;
      socket.join(socket.room);
      console.log('aaa');

      // emit get all messages of this room after join room
      socket.emit('getMessage');
    });

    socket.on('sendChat', function(data) {
      socketio.to(socket.room).emit('updateChat', {username: socket.username, message: data.message, user_id: socket.user_id});

      // emit notify chat to target user by target user's default room id
      socket.broadcast.to(data.target_default_room).emit('notifyChat', {user_id: socket.user_id});
    });

    // send default room id to client's socket
    socket.on('takeCurrentRoomId', function() {
      socket.emit('updateDefaultRoomId', {room_id: socket.id});
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
