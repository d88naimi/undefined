'use strict';
const aws = require('aws-sdk');
const config = require('../../config');
const User = require('../models').user;


const doSomething = function(req, res, next) {
  res.json({result: "OK"});
};

const uploadImage = function (req, res, next) {
  //will not using this...??
  console.log(req.file);
  res.redirect(`/public/upload/${req.file.filename}`);
};

const getSignedRequest = function (req, res, next) {
  const s3 = new aws.S3();
  const fileType = req.query['file-type'];
  const newFilename = `${Date.now()}_${req.query['file-name']}`;
  const bucket = 'portfolio-undefined';
  const s3Params = {
    Bucket: bucket,
    Key: newFilename,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${bucket}.s3.amazonaws.com/${newFilename}`,
      filename: newFilename
    };
    res.json(returnData);
  });
};



module.exports = {
  doSomething,
  uploadImage,
  getSignedRequest
};