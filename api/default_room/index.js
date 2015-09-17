'use strict';

var express = require('express');
var controller = require('./default_room.controller');

var router = express.Router();

// router.get('/', controller.index);
router.get('/:user_id', controller.show);
router.post('/', controller.create);
// router.put('/:id', controller.update);
router.patch('/:user_id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;