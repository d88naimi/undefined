'use strict';
const Sequelize = require('sequelize');
const User = require('../models').user;
const Project = require('../models').project;
const Skill = require('../models').skill;

function handleError(err, req, res, statusCode) {
  err = err ? err : new Error();
  err.status = statusCode || 500;
  let obj = {
    err
  };
  if (req.user) obj.userInfo = req.user;
  return res.status(err.status).render('error', obj);
}

const index = function (req, res, next) {
  const userId = req.user ? req.user.id : null;
  console.log(userId);
  if (userId) {
    User.findById(userId)
      .then(user => {
        if (!user) {
          return handleError(null, req, res, 404);
        }
        console.log(user.profile);
        res.render('index', {
          title: "Undefined Project",
          userInfo: user.profile
        });
      })
      .catch(e => handleError(e, req, res));
  } else res.render('index', {
    title: "Undefined Project"
  });
};


//using this for list of public profiles,
const search = function (req, res, next) {
  const qs = req.query.qs;
  User.findAll(
    {
      attributes: ['id', 'name', 'email', 'githubUsername', 'profileUrl', 'photo', 'role'],
      where: { name: { $like: `${qs}%` } },
    })
    .then(function (users) {
      let obj = {
        users
      };
      if (req.user) obj.userInfo = req.user;

      res.render('search', obj);
    })
    .catch(e => handleError(e, req, res));
};


const myPage = function (req, res, next) {
  if (!req.user) return handleError(null, req, res, 401);
  const user = req.user;
  const userPromise = User.findById(user.id);
  const projectPromise = Project.findAll({
    where: {
      userId: user.id
    },
    include: [{
      model: Skill,
      as: 'skills',
      attributes: ['id', 'name']
    }]
  });
  Promise.all([userPromise, projectPromise]).then(values => {
      const userInfo = values[0];
      const projectArray = values[1];
      const skills = projectArray.skills;

      res.render('myDashboard', {
        userInfo: userInfo,
        projectInfo: projectArray,
        skills
      });
    })
    .catch(e => handleError(e, req, res));
};

const publicPortfolio = function (req, res, next) {
  const developerPromise = User.find({where: {id: +req.params.id}})
    .then(user => {
      if(!user) return handleError(null, req, res, 404);
      return user.profile;
    });

  const projectPromise = Project.findAll({
    where: {
      userId: req.params.id
    },
    include: [{
      model: Skill,
      as: 'skills',
      attributes: ['id', 'name']
    }]
  });

  Promise.all([developerPromise, projectPromise]).then(values => {
      const developer = values[0];
      const projectInfo = values[1];
      if (!developer) return handleError(null, req, res, 404);
      let obj = {
        developer,
        projectInfo
      };
      if (req.user) obj.userInfo = req.user;
      res.render('myPublicPage', obj);

    })
    .catch(e => handleError(e, req, res));
};

const chartPage = function (req, res, next) {
  const userId = +req.params.id;

  const developerPromise = User.find({where: {id: userId}})
    .then(user => {
      if(!user) return handleError(null, req, res, 404);
      return user.profile;
    });

  const projectPromise = Project.findAll({
    where: {
      userId
    },
    attributes: ['language', 'role']
  });

  const skillPromise = Skill.findAll({
    include: [{
      where: {
        userId
      },
      model: Project,
      as: 'projects',
      attributes: ['id']
    }]
  });

  const promiseArr = [projectPromise, skillPromise, developerPromise];
  Promise.all(promiseArr)
    .then(result => {
      const developer = result[2];
      const projects = JSON.stringify(result[0]);
      const skills = JSON.stringify(result[1].map(skill => {
        return {
          id: skill.id,
          name: skill.name,
          frontEnd: skill.frontEnd,
          backEnd: skill.backEnd,
          database: skill.database,
          buildTool: skill.buildTool,
          projects: skill.projects.length
        };
      }));
      let obj = {projects, skills, developer};
      if (req.user) obj.userInfo = req.user;
      console.log("WOWO")
      console.log(developer);

      res.render('chart', obj);
    })
    .catch(e => handleError(e, req, res, null));
};

module.exports = {
  index,
  myPage,
  search,
  publicPortfolio,
  chartPage
};