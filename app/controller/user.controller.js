'use strict';

const User = require('../models').user;
const Project = require('../models').project;

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
const index = function(req, res) {
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
};

/**
 * Get a single user
 */
const show = function(req, res, next) {
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
};

/**
 * Deletes a user
 * restriction: 'admin'???????
 */
const destroy = function(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * My info
 */
const me = function(req, res, next) {
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
    .catch(handleError(res));
};

const showChart = function (req, res, next) {
  const userId = req.params.id;
  Project.findAll({where: {userId}})
    .then(result => {
      console.log(result);
      res.render('chart', {projects: JSON.stringify(result), message: "HEY!!!!"});
    });
};

const saveProfileImageUrl = function (req, res, next) {
  if(!req.user) return res.status(401).end();
  const userId = req.user.id;
  const photo = req.body.photo;
  User.update({photo}, {
    limit: 1,
    where: { id: userId }
  }).then(result => {
    res.json({result: "profile photo changed"});
  })
};

const findUserMatched = function(req, res, next) {
  const qs = req.params.qs;
  User.findAll(
    {
      where: { name: { $like: qs } }
    }).then(function(users) {
      if (!users.length) {
        //add a template to throw a non-match
        console.log("No users with that name");
      }
      res.json({users});
      console.log(users)
    });
};

module.exports = {
  index,
  show,
  destroy,
  me,
  showChart,
  findUserMatched,
  saveProfileImageUrl
};