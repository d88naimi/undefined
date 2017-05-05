'use strict';

const User = require('../models').User;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * only 'admin'???
 */
module.exports.index = function(req, res) {
  return User.findAll({
    attributes: [
      'id',
      'name',
      'email',
      'profileUrl',
      'photo',
      'githubId',
      'role'
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Get a single user
 */
module.exports.show = function(req, res, next) {
  const userId = req.params.id;

  return User.find({
    where: {
      id: userId
    }
  })
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'???????
 */
module.exports.destroy = function(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * My info
 */
module.exports.me = function(req, res, next) {
  const userId = req.user ? req.user.id: null;
  if(!userId) return res.status(401).end();

  return User.find({
    where: {
      id: userId
    },
    attributes: [
      'id',
      'name',
      'email',
      'profileUrl',
      'photo',
      'githubId',
      'role'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
};