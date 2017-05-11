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

//--added router for searchResults
//  we are using the search in routes- user.js
router.get('/search', controller.search);

router.get('/mypage', controller.myPage);
// duplicate from searchResults router.get('/results', controller.searchForThis);

router.get('/portfolio/:id', controller.myPortfolio);


module.exports = router;
