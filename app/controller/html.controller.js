'use strict';
const User = require('../models').user;
const Project = require('../models').project;

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

var david = function(req, res) {
  res.render('david-test', {name: "DAVID"});
}


const myPage = function (req, res, next) {
  if(req.user) {
    var user = req.user;
  }
  const userPromise = User.findById(user.id);
  const projectPromise = Project.findAll({where: {userId: user.id}});

  Promise.all([userPromise, projectPromise]).then(values => { 
    // console.log(values);
    var userInfo = values[0];
    var projectArray = values[1];

    res.render('myDashboard', {userInfo: userInfo, projectInfo: projectArray});
  })
  .catch(handleError(res));
}


module.exports = {
  index,
  upload,
    myPage,
  david

};