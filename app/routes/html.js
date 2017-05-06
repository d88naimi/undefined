/**
 * Created by Hyungwu Pae on 5/3/17.
 */
const express = require('express');
const router = express.Router();
const controller = require('../controller/html.controller');

/* API endpoint */
router.get('/', controller.index);
// router.post('/something', controller.doAnother);
router.get('/upload', controller.upload);
// router.get('/')

router.get('/mypage', controller.myPage);

router.get('/results', controller.searchForThis);

router.get('/portfolio/:id', controller.myPortfolio)

router.get('/david-test', controller.david)


module.exports = router;
