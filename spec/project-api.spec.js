process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const db = require('../app/models');
chai.use(chaiHttp);
const User = require('../app/models').user;
const Skill = require('../app/models').skill;
const Project = require('../app/models').project;
const config = require('../config');
const jwt = require('jsonwebtoken');
let projectId;
let userId;
let token;
let skillId;
describe("Project API", function () {

  before((done) => {
    db.sequelize.sync({}).then(() => {

      User.create({
        name: "TESTUSER",
        email: 'a'+ Math.floor(Math.random()*100) + '@test.com',
        profileUrl: "http://google.com",
        photo: "https://portfolio-undefined.s3.amazonaws.com/1494565693432_ok.png"
      }).then(user => {
        userId = user.id;
        token = jwt.sign({
          id: user.id,
          photo: user.photo,
          name: user.name,
          role: user.role
        }, config.secrets, {
          expiresIn: 60 * 60 * 24 * 365 * 10
        });
        Skill.create({name:"DUMMY"})
          .then(skill => {
            skillId = skill.id;
            done();
          });
      });
    });
  });


  describe("GET: /api/project", () => {
    it('should get all projects', (done) => {
      chai.request(server)
        .get('/api/project')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });


  describe("POST: /api/project", () => {
    it('should create a project', (done) => {

      chai.request(server)
        .post('/api/project')
        .set('Authorization', token)
        .send({name: 'NEWPROJECT', description: 'project description'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('project').that.is.an('object');
          res.body.project.should.have.property('name').that.is.equal('NEWPROJECT');
          res.body.should.have.property('skills').that.is.an('array');
          res.body.skills.length.should.equal(0);
          projectId = +res.body.project.id;
          done();
        })
    });
  });

  describe("GET: /api/project/:id", () => {

    it('should get a project information', (done) => {
      chai.request(server)
        .get('/api/project/' + projectId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name').that.is.a('string');
          done();
        });
    });
  });

  describe("PUT: /api/project/:id", () => {

    it('should edit a project information', (done) => {
      chai.request(server)
        .put('/api/project/' + projectId)
        .set('Authorization', token)
        .send({name: 'CHANGED_NAME', skills: JSON.stringify([skillId]) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('project').that.is.an('object');
          res.body.project.should.have.property('name').that.is.equal('CHANGED_NAME');
          res.body.should.have.property('skills').that.is.a('array');
          done();
        });
    });
  });

  describe("get: /api/project/user/:userId", () => {

    it('should get user\'s projects', (done) => {
      chai.request(server)
        .get('/api/project/user/' + userId)
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('projects').that.is.a('array');
          done();
        });
    });
  });

  describe("DELETE: /api/project/:id", () => {

    it('should delete a project', (done) => {
      chai.request(server)
        .delete('/api/project/' + projectId)
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('result').that.is.equal('deleted');
          done();
        });
    });
  });

});