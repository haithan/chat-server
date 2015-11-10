'use strict';

var express = require('express');
var controller = require('./user.controller');
var passport = require('passport');
var auth = require('../../auth/auth');

var router = express.Router();

// router.get('/', passport.authenticate('bearer', { session: false }), controller.index);
router.get('/:id', passport.authenticate('bearer', { session: false }), controller.show);
router.post('/', function(req, res) {
  auth.requestFromRailsServer(req, res, controller.create);
});
router.put('/:id', function(req, res) {
  auth.requestFromRailsServer(req, res, controller.update);
});
router.patch('/:id', function(req, res) {
  auth.requestFromRailsServer(req, res, controller.update);
});
// router.delete('/:id', controller.destroy);

module.exports = router;