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
//we are using the search under user.controller.js
// const search = function(req, res, next) {
//   const qs = req.body.qs;
//   User.findAll(
//     {
//       
//     }).then(function(users) {
//       if (!users.length) {
//         //add a template to throw a non-match
//         console.log("No users with that name");
//       }
//       console.log(JSON.stringify(users));
//       // res.json(users)
//       res.render('search', {users:users});
//       console.log(users)
//     });
// };

var david = function(req, res) {
  res.render('david-test', {name: "DAVID"});
}

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
    const userInfo = values[0];
    const projectArray = values[1];
    console.log(projectArray);

    res.render('myPublicPage', {userInfo: userInfo, projectInfo: projectArray});

  })
  .catch(handleError(res));
};


module.exports = {
  index,
  upload, 
  myPage,
  // search,
  // searchForThis,
  myPortfolio,
  david
};