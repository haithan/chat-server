

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

// var models = glob.sync(config.root + '/app/models/*.js');
// models.forEach(function (model) {
//   require(model);
// });
var app = express();

require('./config/express')(app, config);

var server = require('http').createServer(app);
var socketio = require('socket.io')(server);

require('./config/socketio')(socketio);


server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port + config.env);
});

