'use strict';

var express = require('express');
var controller = require('./match.controller');
var passport = require('passport');
var auth = require('../../auth/auth');

var router = express.Router();

// router.get('/', controller.index);
router.get('/:source_id/:target_id/:session_id', passport.authenticate('bearer', { session: false }), controller.checkPermission);
router.get('/:id', passport.authenticate('bearer', { session: false }), controller.show);
router.post('/', function(req, res) {
  auth.requestFromRailsServer(req, res, controller.create);
});
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;