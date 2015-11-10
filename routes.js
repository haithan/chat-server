/**
 * Main application routes
 */

'use strict';

// var errors = require('./components/errors');
var config = require('./config/config');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var auth = require('./auth/auth');

module.exports = function(app) {

  passport.use(new Strategy(
    function(token, cb) {
      auth.findUserByJWT(token, cb);
    }
  ));

  app.use('/api/users', require('./api/user'));
  app.use('/api/matchs', require('./api/match'));
  app.use('/api/fb_infos', require('./api/fb_info'));

  app.use('/api/*',
          passport.authenticate('bearer', { session: false }),
          function(req, res, next) {
            next();
          });

  // Insert routes below
  app.use('/api/blocks', require('./api/block'));
  app.use('/api/notifications', require('./api/notification'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/gcms', require('./api/gcm'));

  // app.get('/', function(req, res) {
  //   var myCookie = jwt.verify(req.cookies.x_user, config.secret_key);
  //   res.send(myCookie);
  // });

  // app.use('/auth', require('./auth'));
  // app.route('/app/emojis.png')
  //   .get(function(req,res) {
  //     res.sendFile(path.resolve(app.get('appPath') + '/bower_components/angular-emoji-filter-hd/dist/emojis.png'));
  //   });

  // // All undefined asset or api routes should return a 404
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //  .get(errors[404]);

  // app.route('/matching/:session_id')
  //   .get(function(req,res) {
  //     console.log(req.params)
  //     res.sendFile(path.resolve(app.get('appPath') + '/index.html/' + req.params.session_id))
  //   });

  app.route('/auth')
    .get(function(req,res) {
      auth.authenticateWeb(req.cookies, function(err, user) {
        if (err) { return res.status(500).send(err); }
        if (typeof user === 'undefined' || !user) { return res.sendStatus(403); }
        return res.send({user_id: user.user_id, auth_token: req.cookies.x_user});
      });
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
