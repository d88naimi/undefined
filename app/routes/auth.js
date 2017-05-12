'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportConfig = require('../../config/passport')

passportConfig.setup();
router
  .get('/github', passport.authenticate('github', {
    failureRedirect: '/',
    scope: ['user:email'],
    session: false
  }))
  .get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/',
    session: false
  }), passportConfig.setTokenCookie);


router.get('/logout', function(req, res){
  const name = req.user ? req.user.name : "Guest";
  console.log("LOG OUT " + name);
  req.logout();
  res.cookie('jwt_token', '', {expires: new Date('1970-01-01 00:00:00 UTC+00')}); //expire
  res.redirect('/');
});


module.exports = router;