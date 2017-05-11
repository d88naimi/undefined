'use strict';

const User = require('../models').user;
const Project = require('../models').project;

function handleError(err, req, res, statusCode) {
  err = err ? err : new Error();
  err.status = statusCode || 500;
  let obj = {err};
  if(req.user) obj.userInfo = req.user;
  return res.status(err.status).render('error', obj);
}

/**
 * Get list of users
 * only 'admin'???
 */
const index = function(req, res) {
  return User.findAll({
    attributes: [ 'id', 'name', 'email', 'profileUrl', 'photo', 'githubUsername', 'role']
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(e => handleError(e, req, res, null));
};

/**
 * Get a single user
 */
const show = function(req, res, next) {
  const userId = req.params.id;

  return User.find({ where: { id: userId } })
    .then(user => {
      if(!user) return res.status(404).end();
      res.json(user.profile);
    })
    .catch(e => handleError(e, req, res, null));
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
    .catch(e => handleError(e, req, res, null));
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
    attributes: [ 'id', 'name', 'email', 'profileUrl', 'photo', 'githubId', 'role' ]
  })
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(e => handleError(e, req, res, null));
};

const showChart = function (req, res, next) {
  const userId = req.params.id;
  Project.findAll({where: {userId}})
    .then(result => {
      res.render('chart', {projects: JSON.stringify(result), message: "HEY!!!!"});
    })
    .catch(e => handleError(e, req, res, null));
};

const saveProfileImageUrl = function (req, res, next) {
  if(!req.user) return handleError(null, req, res, 401);
  const userId = req.user.id;
  const photo = req.body.photo;
  User.update({photo}, {
    limit: 1,
    where: { id: userId }
  })
    .then(() => res.json({result: "profile photo changed"}))
    .catch(e => handleError(e, req, res, null));
};

module.exports = {
  index,
  show,
  destroy,
  me,
  showChart,
  saveProfileImageUrl
};