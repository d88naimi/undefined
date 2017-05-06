/**
 * Created by Hyungwu Pae on 5/3/17.
 */
'use strict';

const path = require('path');
const _ = require('lodash');

module.exports = {
  root: path.normalize(__dirname + '/../'),
  // Secret for session
  secrets: 'slo43#$$^*Zwpk0!',
  amazon: {
    key: 'AKIAIXU3G6J7SP45SXCA',
    secret: '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',
    bucket: '',
    storageClass: '',
    ACL: 'public-read'
  },

  github: {
    clientID: "78c16f60046b5d383ce7",
    clientSecret: "fa55143cebcfee2b03ce60ebccb8c8e75ffaab55",
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: [ 'user:email']
  },

  // userRoles: ['guest', 'user', 'admin'], //sequence is important

  facebook: { //production
    clientID:     "",
    clientSecret: "",
    callbackURL:  ""
  },

  google: {
    clientID: "",
    clientSecret: "",
    callbackURL: ""
  }

};