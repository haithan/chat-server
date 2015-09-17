'use strict';

var express = require('express');
var controller = require('./notification.controller');

var router = express.Router();

router.get('/:to_user_id', controller.index);
router.get('/:from_user_id/:to_user_id', controller.show);
router.post('/', controller.create);
// router.put('/:id', controller.update);
router.patch('/:from_user_id/:to_user_id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;