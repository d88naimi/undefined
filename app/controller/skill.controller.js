/**
 * Created by Hyungwu Pae on 5/4/17.
 */
'use strict';
const config = require('../../config');
const Skill = require('../models').skill;
const Project = require('../models').project;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return res.render('error', {statusCode});
}

const listAll = function (req, res, next) {
  Skill.findAll({})
    .then(skills => {
    res.json(skills);
    })
};

const findSkill = function (req, res, next) {
  Skill.findById(+req.params.id)
    .then(skill => {
      res.json(skill);
    })
};

const findSkillOfProject = function (req, res, next) {
  const projectId = +req.params.projectId;
  Project.getSkills({
    include: [{ //TODO: NOT WORKING !!@#
      model: Project,
      through: {
        where: { projectId }
      }
    }]
  })
    .then(results => {
      console.log(results);
      return res.json(results)
    })
    .catch(e => {
      console.log(e);
      handleError(res, 500)
    });
};

const createSkill = function(req, res, next) {
  Skill.create(req.body)
    .then(() => {
      res.json({result:"created"});
    });
};

const deleteSkill = function(req, res, next) {
  const id = req.query.id;
  Skill.delete({where: { id }})
    .then(() => {
      res.json({result:"deleted"});
    });
};

module.exports = {
  listAll,
  findSkill,
  createSkill,
  deleteSkill,
  findSkillOfProject
};