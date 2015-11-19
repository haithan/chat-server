'use strict';

var config = require('../config/config');
var ironMq = require('iron_mq');

exports.imq = new ironMq.Client({token: config.mq_token, project_id: config.mq_id, host: config.mq_host});