'use strict';

const User = require('../models').user;
const Project = require('../models').project;
const Skill = require('../models').skill;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

const index = function(req, res, next) {
  const userId = req.user ? req.user.id: null;
  console.log(userId);
  if(userId) {
    User.findById(userId)
      .then(user => {
        if(!user) {
          return res.status(404).end();
        }
        console.log(user.profile);
        res.render('index',{title: "Undefined Project", userInfo: user.profile});
      });
  }
  else res.render('index',{title: "Undefined Project"});
};

const upload = function (req, res, next) {
  res.render('upload', {allowRemove: true})
};

//using this for list of public profiles,
const search = function(req, res, next) {
  const qs = req.query.qs;
  User.findAll(
    {
      attributes: ['id', 'name', 'email', 'profileUrl', 'photo', 'role'],
      where: { name: { $like: `${qs}%` } },

    })
    .then(function(users) {
      let obj = {users};
      if(req.user) obj.userInfo = req.user;

      res.render('search', obj);
    });
};


const myPage = function (req, res, next) {
  if(!req.user) return res.render('error', {message: 'Please login to see the content'});
  const user = req.user;
  const userPromise = User.findById(user.id);
  const projectPromise = Project.findAll({
    where: {userId: user.id},
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

    res.render('myDashboard', {userInfo: userInfo, projectInfo: projectArray, skills});

    //console.log(values); // [3, 1337, "foo"] 
  })
    .catch(e => res.status(404).end());
};

const myPortfolio = function (req, res, next) {
  const userPromise = User.findById(req.params.id);
  const projectPromise = Project.findAll({where: {userId: req.params.id}});

  Promise.all([userPromise, projectPromise]).then(values => {
    const developer = values[0];
    const projectInfo = values[1];
    let obj = {developer, projectInfo};
    if(req.user) obj.userInfo = req.user;
    res.render('myPublicPage', obj);

  })
    .catch(handleError(res));
};


module.exports = {
  index,
  upload,
  myPage,
  search,
  myPortfolio
};