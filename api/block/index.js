'use strict';

var express = require('express');
var controller = require('./block.controller');

var router = express.Router();

// router.get('/', controller.index);
router.get('/:source_id/:target_id', controller.show);
router.post('/', controller.create);
router.put('/:source_id/:target_id', controller.update);
router.patch('/:source_id/:target_id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;