'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');

router.get('/', controller.index);
// router.get('/search', controller.findUserMatched);
router.delete('/:id', controller.destroy);
router.get('/me', controller.me);
router.get('/:id/chart-test', controller.showChart);
router.get('/:id', controller.show);
router.put('/profile-image', controller.saveProfileImageUrl);

module.exports = router;
