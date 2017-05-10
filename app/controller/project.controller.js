/**
 * Created by Hyungwu Pae on 5/5/17.
 */
'use strict';
const config = require('../../config');
const Skill = require('../models').skill;
const User = require('../models').user;
const Project = require('../models').project;
const request = require('request-promise');

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
    .then(project => {
      if(!project) return res.render('error', {letter: 'a', statusCode: 404})
      res.json(project);
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
      if(!project) return res.render('error', {message: "Could not find a project"})
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
  if(!skillIds.length) return res.status(400).end();

  Project.findById(projectId)
    .then(project => {
      if(project) res.status(404).end();
      project.addSkills(skillIds)
        .then(() => {
          res.status(200).end();
        });
    })
    .catch(handleError(res))
};

const editProject = function(req, res, next) {
  if(!res.user) return res.status(400).end();
  const userId = req.user.id;
  Project.findById(projectId)
    .then(project => {
      if(project.userId !== userId) return res.status(401).end(); 
      if(!project) return res.render('error', {message: "Could not find a project"})

      

      project.addSkills(skillIds)
        .then(() => {
          res.status(200).end();
        });
    }).catch(handleError(res, 404));

  


};


const githubSync = function (req, res, next) {
  if(!req.user) return res.status(401).end();

  const userId = req.user.id;
  User.findById(userId)
    .then(user => {
      const options = {
        uri: `https://api.github.com/users/${user.githubUsername}/repos`,
        qs: {
          client_id: config.github.clientID,
          client_secret: config.github.clientSecret
        },
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };

      request(options)
        .then(repos => {
          const projects = repos.map(repo => {
            return {
              name: repo.name,
              githubRepo: repo.html_url,
              description: repo.description || null,
              hasGithubRepo: true,
              forksCount: repo.forks_count,
              stargazersCount: repo.stargazers_count,
              watchersCount: repo.watchers_count,
              userId: user.id,
              language: repo.language || null,
              url: repo.homepage || null,
            }
          });
          Project.destroy({
            where: {
              githubRepo: { $ne: null },
              userId: userId
            }
          }).then(() => {
            Project.bulkCreate(projects)
              .then(() => {
                console.log("user repos imported.");
                res.json({result: "Done"});
              });
          });

        });
    }).catch(e => {
    console.log(e);
    res.status(500).end()
  });



};


module.exports = {
  listAll,
  findProject,
  createProject,
  deleteProject,
  addSkillToPjt,
  addSkillsToPjt,
  findUserProjects,
  githubSync,
  editProject
};