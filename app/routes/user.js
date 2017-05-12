'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');

router.get('/', controller.index);
router.get('/me', controller.me);
router.get('/:id', controller.show);

router.put('/profile-image', controller.saveProfileImageUrl);

router.delete('/:id', controller.destroy);

module.exports = router;
