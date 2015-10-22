var express = require('express');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');

var cors = require('cors');
var path = require('path');
var sassMiddleware = require('node-sass-middleware');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // app.set('views', config.root + '/app/views');
  // app.set('view engine', 'jade');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());

  app.use(cors());
  app.set('appPath', path.join(config.root, 'client'));

  app.use(
    sassMiddleware({
      src: '/',
      dest: '/',
      debug: true
    })
  );

  app.use(express.static(path.join(config.root, 'client')));

  // var controllers = glob.sync(config.root + '/app/controllers/*.js');
  // controllers.forEach(function (controller) {
  //   require(controller)(app);
  // });
  require('../routes')(app);

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  if (app.get('env') === 'production') {
    app.get("*", function (req, res, next) {
      res.redirect("https://" + req.header.host + "/" + req.path);
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.json({
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
