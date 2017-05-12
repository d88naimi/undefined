/**
 * Created by Hyungwu Pae on 5/3/17.
 */
const User = require('../app/models').user;
const Project = require('../app/models').project;
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const request = require('request-promise');
const config = require('./index');

module.exports.setup = function () {
  passport.use(new GitHubStrategy(config.github,
    function(accessToken, refreshToken, profile, done) {
      User.find({where: {'githubId': profile.id}})
        .then(user => {
          if(user) {
            return done(null, user);
          }
          user = User.build({
            name: profile.displayName,
            email: profile.emails[0].value,
            profileUrl: profile.profileUrl,

            username: profile.username,
            githubId: profile.id,
            githubUsername: profile.username,
            photo: profile.photos[0].value
          });
          user.save()
            .then(savedUser => {
              done(null, savedUser);
              getRepos(savedUser);
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
};


//Set token cookie for oAuth strategies
module.exports.setTokenCookie = function (req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  console.log(req.user);
  const token = signToken({
    id: req.user.id,
    photo: req.user.photo,
    name: req.user.name,
    role: req.user.role
  });
  res.cookie('jwt_token', token);
  res.redirect('/');
};


module.exports.serializeUser = function(req, res, next) {
  let token;
  if(req.headers.authorization) {
    token = req.headers.authorization;
  } else token = req.cookies.jwt_token;
  if(token) {
    jwt.verify(token, config.secrets, function (err, user) {
      if(err) {
        return next();
      }
      req.user = user;
      return next();
    });
  }
  else next();
};

function signToken(user) {
  return jwt.sign(user, config.secrets, {
    expiresIn: 60 * 60 * 24 * 365 * 10 // 10 years
  });
}

function getRepos(user) {
  /** fetch git repo */
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
          language: repo.language || 'etc.',
          url: repo.homepage || null
        }
      });
      Project.bulkCreate(projects)
        .then(() => {
          console.log("user repos imported.");
        })
    });

}