/**
 * Created by Hyungwu Pae on 5/5/17.
 */
'use strict';
const config = require('../../config');
const Skill = require('../models').skill;
const Project = require('../models').project;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

const listAll = function (req, res, next) {
  Project.findAll({})
    .then(skills => {
      res.json({skills});
    })
};

const findProject = function (req, res, next) {
  Project.findById(req.params.id)
    .then(projects => {
      res.json(projects);
    })
    .catch(e => res.status(404).end());
};

const findUserProjects = function (req, res, next) {
  const userId = req.params.userId;
  Project.findAll({where: {userId}})
    .then(result => {
      res.json({projects: result});
    })
    .catch(e => res.status(404).end());

};

const createProject = function(req, res, next) {
  Project.create(req.body)
    .then(() => {
      res.json({result:"created"});
    });
};

const deleteProject = function(req, res, next) {
  const id = req.query.id;
  Project.delete({where: { id }})
    .then(() => {
      res.json({result:"deleted"});
    });
};

const addSkillToPjt = function (req, res, next) {
  const projectId = +req.params.id;
  const skillId = +req.body.skill;

  if(!skillId) return res.status(400).end();

  Project.findById(projectId)
    .then(project => {
      if(!project) res.status(404).end();
      project.addSkill(skillId)
        .then(() => {
          res.status(200).end();
        });
    })
    .catch(handleError(res))

};

const addSkillsToPjt = function (req, res, next) {
  const projectId = req.param.id;
  const skillIds = req.body.skills;
  if(!skillIds) res.status(400);

  Project.findById(projectId)
    .then(project => {
      if(project) res.status(404).end();
      project.addSkills(skillIds)
        .then(() => {
          res.status(200).end();
        });
    })
    .catch(handleError(res));


};

module.exports = {
  listAll,
  findProject,
  createProject,
  deleteProject,
  addSkillToPjt,
  addSkillsToPjt,
  findUserProjects
};