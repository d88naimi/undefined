const express = require('express');
const router = express.Router();
const controller = require('../controller/api.controller');
const path = require('path');
const config = require('../../config');

const multer  = require('multer');
const storage = multer.diskStorage({
  destination: path.join(config.root, '/public/upload'),
  filename: function (req, file, cb) {
    cb(null, `img_${Date.now()}.${file.originalname.split('.')[1]}`)
  }
});
const upload = multer({
  limits: {files: 1, fileSize: 5242880},
  onFileSizeLimit: function (file) {
    console.log('Failed: ', file.originalname);
  },
  storage: storage
});

/* API endpoint */
router.get('/something', controller.doSomething);
router.post('/upload', upload.single('screenshot'), controller.uploadImage);
router.get('/s3-signed-req', controller.getSignedRequest);
module.exports = router;