'use strict';

var express = require('express');
var controller = require('./gcm.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;