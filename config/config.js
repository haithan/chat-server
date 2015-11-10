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
    db: 'mongodb://localhost/chat-server-development',
    secret_key: 'a0ef38ee4c364d973a023c1a8a7de51f10d6990ee7412166911c8ddfa5d9',
    main_web: 'lvh.me:3000',
    ggSenderId: 'AIzaSyBmFcDkIMWiNTU8cClehEAR8s5Fr1cSlV4',
    env: 'development',
    rails_ip: '127.0.0.1'
  },

  test: {
    root: rootPath,
    app: {
      name: 'chat-server'
    },
    port: 8123,
    db: 'mongodb://localhost/chat-server-test',
    secret_key: 'a0ef38ee4c364d973a023c1a8a7de51f10d6990ee7412166911c8ddfa5d9',
    main_web: 'lvh.me:3000',
    ggSenderId: 'AIzaSyBmFcDkIMWiNTU8cClehEAR8s5Fr1cSlV4',
    env: 'test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'chat-server'
    },
    port: 8123,
    db: 'mongodb://localhost/chat-server-production',
    secret_key: 'a0ef38ee4c364d973a023c1a8a7de51f10d6990ee7412166911c8ddfa5d9',
    main_web: 'https://ymeet.me',
    ggSenderId: 'AIzaSyBmFcDkIMWiNTU8cClehEAR8s5Fr1cSlV4',
    env: 'production',
    rails_ip: '103.56.157.70'
  }

};

module.exports = config[env];
