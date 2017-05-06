/**
 * Created by Hyungwu Pae on 5/3/17.
 */
const User = require('../app/models').user;
const Project = require('../app/models').project;
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');
var request = require('request-promise');
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
              /** fetch git repo */
              const options = {
                uri: `https://api.github.com/users/${savedUser.githubUsername}/repos`,
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
                      userId: savedUser.id
                    }
                  });
                  Project.bulkCreate(projects)
                    .then(() => {
                      console.log("user repos imported.");
                    })
                });



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
  const token = signToken(req.user.id, req.user.role);
  res.cookie('id_token', token);
  res.redirect('/');
};


module.exports.serializeUser = function(req, res, next) {
  const token = req.cookies.id_token;
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

function signToken(id, role) {
  return jwt.sign({ id, role }, config.secrets, {
    expiresIn: 60 * 60 * 24 * 365 * 10 // 10 years
  });
}
