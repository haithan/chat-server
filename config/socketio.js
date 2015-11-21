/**
 * Socket.io configuration
 */

'use strict';

var Gcm = require('../api/gcm/gcm.model');
var nodeGcm = require('node-gcm');
var config = require('./config');
var Notification = require('../api/notification/notification.model');
var Block = require('../api/block/block.model');
var Message = require('../api/message/message.model');
var Crypto = require('../crypto/crypto');
var imq = require('../mq/mq');

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
  require('../api/fb_info/fb_info.socket').register(socket);
  require('../api/user/user.socket').register(socket);
  require('../api/block/block.socket').register(socket);
  require('../api/notification/notification.socket').register(socket);
  require('../api/message/message.socket').register(socket);
  require('../api/gcm/gcm.socket').register(socket);
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

    var postImq = function(message) {
      var queue = imq.imq.queue(config.notify_queue);

      queue.post({body: JSON.stringify(message)}, function(error, body) {
        if (error) {console.log(error);}
      });
    }

    var performUpdate = function(fromUserId, toUserId, notiNum) {
      Notification.findOne({from_user_id: fromUserId, to_user_id: toUserId}, function(err, noti) {
        if (noti) {
          if (typeof notiNum !== 'undefined') {
            noti.noti_num = notiNum;
          } else {
            noti.noti_num = noti.noti_num + 1;
          }
          noti.save();
          postImq({from_user_id: fromUserId, to_user_id: toUserId, notiNum: noti.noti_num, room_id: socket.room});
        } else {
          var noti_num = typeof notiNum !== 'undefined' ? notiNum : 1;
          Notification.create({from_user_id: socket.userId, to_user_id: data.targetUserId, noti_num: noti_num});
          postImq({from_user_id: fromUserId, to_user_id: toUserId, notiNum: noti_num, room_id: socket.room});
        }
      });
    }

    socket.on('addUser', function(data) {
      // leave previous room
      if (socket.room) {
        socket.leave(socket.room);
      }
      socket.room = data.room;
      socket.userId = data.userId;
      socket.join(socket.room);

      performUpdate(data.targetUserId, socket.userId, 0);

      // emit get all messages of this room after join room
      socket.emit('getMessage', {room: socket.room, userId: socket.userId});
    });

    socket.on('user:leaveRoom', function () {
      socket.leave(socket.room);
    });

    socket.on('sendChat', function(data) {
      if (data.targetUserId === 'undefined') { return; }

      var message = Crypto.decrypt(data.message);

      var targetUserInRoom = function() {
        var clients = socketio.sockets.adapter.rooms[socket.room];

        if (clients.length === 0) { return; }
        for (var clientId in clients) {
          if (socketio.sockets.connected[clientId].userId == data.targetUserId) {
            return true;
          }
        }

        return false;
      };

      var updateNotification = function() {
        if ( targetUserInRoom() ) { return; }

        performUpdate(socket.userId, data.targetUserId);
      };

      var notyMobile = function(targetUserGgIds) {
        if ( targetUserGgIds == '' || targetUserInRoom() ) { return; }

        var GcmMessage = new nodeGcm.Message();
        GcmMessage.addNotification('title', 'Bạn có tin nhắn mới');
        GcmMessage.addNotification('icon', 'ic_notification');
        GcmMessage.addNotification('body', message);

        var regIds = data.targetUserGgIds;
        var sender = new nodeGcm.Sender(config.ggSenderId);

        sender.send(GcmMessage, regIds, function(err, result) {
          if(err) {
            console.error(err);
          } else {
            console.log(result);
          }
        });
      };

      // check if current user is blocked by target user
      Block.findOne({source_id: data.targetUserId, target_id: socket.userId}, function(err, block) {
        if (block && block.block) {
          socket.emit('user:isBlocked', {targetUserId: data.targetUserId});
        } else {
          // emit event has new message
          socketio.to(socket.room).emit('updateChat', {message: data.message, user_id: socket.userId});
          // save to DB
          Message.create({message: message, user_id: socket.userId, session_id: socket.room});
          // emit notify chat to target user by target user's default room id
          notyMobile(data.targetUserGgIds);

          updateNotification();
        }
      });
    });
    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
