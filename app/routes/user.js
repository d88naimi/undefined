'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');

router.get('/', controller.index);
router.delete('/:id', controller.destroy);
router.get('/chart-test', controller.showChart);
router.get('/me', controller.me);
router.get('/:id', controller.show);
module.exports = router;
