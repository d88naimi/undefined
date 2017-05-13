
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const db = require('../app/models');
chai.use(chaiHttp);
const User = require('../app/models').user;
const jwt = require('jsonwebtoken');
const config = require('../config');
let userId;
let token;

describe("User API", function () {

  before((done) => {
    db.sequelize.sync({}).then(() => {

      User.create({
        name: "TESTUSER",
        email: 'testuser@example.com',
        profileUrl: "http://google.com",
        photo: "https://portfolio-undefined.s3.amazonaws.com/1494565693432_ok.png",
        role: 'user'
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
        done();
      });
    });
  });

  after((done) => {
    User.destroy({ where: { id: userId } })
      .then(() => done());
  });

  describe("GET: /api/user", () => {
    it('should get a user list', (done) => {
      chai.request(server)
        .get('/api/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });


  describe("GET: /api/user/:id", () => {

    it('should get a user list', (done) => {
      chai.request(server)
        .get('/api/user/' + userId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name').that.is.a('string');
          done();
        });
    });
  });

  describe("DELETE: /api/user/:id", () => {

    it('should get a user list', (done) => {
      chai.request(server)
        .get('/api/user/' + userId)
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});