/**
 * Created by Hyungwu Pae on 5/3/17.
 */
const express = require('express');
const router = express.Router();
const controller = require('../controller/html.controller');

/* API endpoint */
router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/mypage', controller.myPage);
router.get('/chart/:id', controller.chartPage);
router.get('/portfolio/:id', controller.publicPortfolio);


module.exports = router;
