var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'chat-server'
    },
    port: 8123,
    db: 'mongodb://localhost/chat-server-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'chat-server'
    },
    port: 8123,
    db: 'mongodb://localhost/chat-server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'chat-server'
    },
    port: 8123,
    db: 'mongodb://localhost/chat-server-production'
  }
};

module.exports = config[env];
