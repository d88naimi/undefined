/**
 * Created by Hyungwu Pae on 5/5/17.
 */
'use strict';
const config = require('../../config');
const Skill = require('../models').skill;
const User = require('../models').user;
const Project = require('../models').project;
const request = require('request-promise');

function handleError(err, req, res, statusCode) {
  err = err ? err : new Error();
  err.status = statusCode || 500;
  let obj = {err};
  if(req.user) obj.userInfo = req.user;
  return res.status(err.status).render('error', obj);
}

const listAll = function (req, res, next) {
  Project.findAll({})
    .then(pjts => {
      res.json({pjts});
    })
    .catch(e => handleError(e, req, res));
};

const findProject = function (req, res, next) {
  Project.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: Skill,
      through: {
        where: { projectId }
      }
    }]
  })
    .then(project => {
      if(!project) return handleError(null, req, res, 404);
      res.json(project);
    })
    .catch(e => handleError(e, req, res));
};

const findUserProjects = function (req, res, next) {
  const userId = req.params.userId;
  Project.findAll({
    where: {userId},
    include: [{
      model: Skill,
      as: 'skills',
      attributes: ['id', 'name']
    }]
  })
    .then(result => {
      res.json({projects: result});
    })
    .catch(e => handleError(e, req, res));


};

const createProject = function(req, res, next) {
  if(!req.user) return handleError(null, req, res, 401);
  if(!req.body.name) return handleError(null, req, res, 400);
  const userId = +req.user.id;

  let newProject = { userId };
  newProject.name = req.body.name;
  if(req.body.description) newProject.description = req.body.description;
  if(req.body.role) newProject.role = req.body.role;
  if(req.body.teamMate) newProject.teamMate = req.body.teamMate;
  if(req.body.url) newProject.url = req.body.url;
  if(req.body.screenshot) {
    newProject.screenshot = req.body.screenshot;
    const urlArry = req.body.screenshot.split(".s3.amazonaws.com/");
    newProject.thumbnail = urlArry[0] + "-thumbnail.s3.amazonaws.com/thumbnail-" + urlArry[1];
  }
  Project.create(newProject)
    .then(project => {
      project.addSkills(JSON.parse(req.body.skills))
        .then(skills => {
          res.json({project, skills: skills[0]});
        })
        .catch(e => handleError(e, req, res));
    })
    .catch(e => handleError(e, req, res));

};

const deleteProject = function(req, res, next) {
  const id = req.query.id;
  Project.delete({where: { id }})
    .then(() => {
      res.json({result:"deleted"});
    })
    .catch(e => handleError(e, req, res));
};

const addSkillToPjt = function (req, res, next) {
  const projectId = +req.params.id;
  const skillId = +req.body.skill;

  if(!skillId) return handleError(null, req, res, 400);

  Project.findById(projectId)
    .then(project => {
      if(!project) return handleError(null, req, res, 404);
      project.addSkill(skillId)
        .then(() => {
          res.status(200).end();
        });
    })
    .catch(e => handleError(e, req, res));

};

const addSkillsToPjt = function (req, res, next) {
  const projectId = req.param.id;
  const skillIds = req.body.skills;
  if(!skillIds.length) return handleError(req, res, 400);

  Project.findById(projectId)
    .then(project => {
      if(project) return handleError(req, res, 404);
      project.addSkills(skillIds)
        .then(() => {
          res.status(200).end();
        });
    })
    .catch(e => handleError(e, req, res, null));
};

const editProject = function(req, res, next) {
  if(!req.user) return handleError(req, res, 401);
  const userId = +req.user.id;
  const projectId = +req.params.id;

  Project.findById(projectId)
    .then(project => {
      //Not found
      if(!project) return handleError(null, req, res, 404);
      //This project is not yours!
      if(project.userId !== userId) return handleError(null, req, res, 401);

      //exclude unnecessary info.
      let toBeUpdated = {};
      if(req.body.description) toBeUpdated.description = req.body.description;
      if(req.body.name) toBeUpdated.name = req.body.name;
      if(req.body.role) toBeUpdated.role = req.body.role;
      if(req.body.teamMate) toBeUpdated.teamMate = req.body.teamMate;
      if(req.body.url) toBeUpdated.url = req.body.url;
      if(req.body.screenshot) {
        toBeUpdated.screenshot = req.body.screenshot;
        const urlArry = req.body.screenshot.split(".s3.amazonaws.com/");
        toBeUpdated.thumbnail = urlArry[0] + "-thumbnail.s3.amazonaws.com/thumbnail-" + urlArry[1];
      }

      let promiseArray = [];
      promiseArray.push(project.update(toBeUpdated));
      if(req.body.skills) promiseArray.push(project.addSkills(JSON.parse(req.body.skills)));
      Promise.all(promiseArray)
        .then(([project, skills]) => {
          res.json({project, skills: skills[0]});
        })
        .catch(e => handleError(e, req, res));




    }).catch(e => handleError(e, req, res));

};


const githubSync = function (req, res, next) {
  if(!req.user) return handleError(null, req, res, 401);

  const userId = +req.user.id;
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
    })
    .catch(e => handleError(e, req, res));





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