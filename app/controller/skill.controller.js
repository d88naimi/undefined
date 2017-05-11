/**
 * Created by Hyungwu Pae on 5/4/17.
 */
'use strict';
const config = require('../../config');
const Skill = require('../models').skill;
const Project = require('../models').project;

function handleError(err, req, res, statusCode) {
  err = err ? err : new Error();
  err.status = statusCode || 500;
  let obj = {err};
  if(req.user) obj.userInfo = req.user;
  return res.status(err.status).render('error', obj);
}

const listAll = function (req, res, next) {
  Skill.findAll({})
    .then(skills => {
      res.json(skills);
    })
    .catch(e => handleError(e, req, res));
};

const findSkill = function (req, res, next) {
  Skill.findById(+req.params.id)
    .then(skill => {
      res.json(skill);
    })
    .catch(e => handleError(e, req, res));
};

const createSkill = function(req, res, next) {
  Skill.create(req.body)
    .then(() => {
      res.json({result:"created"});
    })
    .catch(e => handleError(e, req, res));
};

const deleteSkill = function(req, res, next) {
  const id = req.query.id;
  Skill.delete({where: { id }})
    .then(() => {
      res.json({result:"deleted"});
    })
    .catch(e => handleError(e, req, res));
};

module.exports = {
  listAll,
  findSkill,
  createSkill,
  deleteSkill,
};