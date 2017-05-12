'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
     Add altering commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.bulkInsert('Person', [{
     name: 'John Doe',
     isBetaMember: false
     }], {});
     */

    return queryInterface.bulkInsert('skills', [
      //database
      {
        name: 'MongoDB',
        backEnd: true,
        database: true
      },
      {
        name: 'MySQL',
        backEnd: true,
        database: true
      },
      {
        name: 'Firebase',
        backEnd: true,
        database: true
      },
      {
        name: 'PostgreSQL',
        backEnd: true,
        database: true
      },
      {
        name: 'SQLite',
        backEnd: true,
        database: true
      },
      {
        name: 'MariaDB',
        backEnd: true,
        database: true
      },
      {
        name: 'Oracle',
        backEnd: true,
        database: true
      },
      {
        name: 'Firebird',
        backEnd: true,
        database: true
      },
      {
        name: 'MS SQL Server',
        backEnd: true,
        database: true
      },
      {
        name: 'CouchDB',
        backEnd: true,
        database: true
      },
      {
        name: 'Redis',
        backEnd: true,
        database: true
      },
      {
        name: 'DB2',
        backEnd: true,
        database: true
      },
      {
        name: 'Sybase',
        backEnd: true,
        database: true
      },
      {
        name: 'Teradata',
        backEnd: true,
        database: true
      },






      //frontend javascript framework, library
       {
        name: 'HTML 5',
        frontEnd: true,
        language: 'CSS'
      },
       {
        name: 'CSS 3',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Javascript',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'jQuery',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Polymer',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'React',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Angular',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Vue.js',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Backbone.js',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Ember.js',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'knockout.js',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Spine',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Brick',
        frontEnd: true,
        language: 'Javascript'
      },




      //frontend PHP framework
      {
        name: 'Laravel',
        frontEnd: true,
        language: 'PHP'
      },
      {
        name: 'Symfony',
        frontEnd: true,
        language: 'PHP'
      },
      {
        name: 'CodeIgniter',
        frontEnd: true,
        language: 'PHP'
      },
      {
        name: 'CakePHP',
        frontEnd: true,
        language: 'PHP'
      },
      {
        name: 'Phalcon',
        frontEnd: true,
        language: 'PHP'
      },




      //Backend .NET framwork
      {
        name: 'ASP.NET MVC',
        backEnd: true,
        language: 'C#'
      },
      {
        name: 'ASP.NET WEBAPI',
        backEnd: true,
        language: 'C#'
      },




      //Task Runners and Bundlers
      {
        name: 'Grunt',
        buildTool: true
      },
      {
        name: 'Bower',
        buildTool: true
      },
      {
        name: 'Gulp',
        buildTool: true
      },
      {
        name: 'Webpack',
        language: 'Javascript',
        frontEnd: true
      },
      {
        name: 'Browserify',
        language: 'Javascript',
        frontEnd: true
      },
      {
        name: 'Rollup',
        language: 'Javascript',
        frontEnd: true
      },
      {
        name: 'SystemJS',
        language: 'Javascript',
        frontEnd: true
      },
      {
        name: 'JSPM',
        language: 'Javascript',
        frontEnd: true
      },





      //Testing
      {
        name: 'Jasmine',
        language: 'Javascript',
        testing: true
      },
      {
        name: 'Karma',
        language: 'Javascript',
        testing: true
      },
      {
        name: 'Mocha',
        language: 'Javascript',
        testing: true
      },
      {
        name: 'Cucumber',
        language: 'Javascript',
        testing: true
      },
      {
        name: 'Jest',
        language: 'Javascript',
        testing: true
      },
      {
        name: 'Phpunit',
        language: 'PHP',
        testing: true
      },
      {
        name: 'Codeception',
        language: 'PHP',
        testing: true
      },
      {
        name: 'Behat',
        language: 'PHP',
        testing: true
      },









      // frontend css framework
      {
        name: 'Bootstrap',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Semantic-UI',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Materialize',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Material UI',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Pure',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Foundation',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Skeleton',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'UIKit',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Milligram',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Susy',
        frontEnd: true,
        language: 'CSS'
      },




      //backend
      {
        name: 'Express.js',
        backEnd: true,
        language: 'Javascript'
      },
      {
        name: 'NodeJS',
        backEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Hapi.js',
        backEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Meteor',
        backEnd: true,
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Sails.js',
        backEnd: true,
        language: 'Javascript'
      },

      {
        name: 'Django',
        backEnd: true,
        language: 'Python'
      },
      {
        name: 'Spring MVC',
        backEnd: true,
        language: 'Java'
      },
      {
        name: 'Struts 2',
        backEnd: true,
        language: 'Java'
      },



      //css preprocessor
      {
        name: 'Haml',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'SCSS',
        frontEnd: true,
        language: 'CSS'
      },

      {
        name: 'Stylus',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Myth',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Rework',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'Sass',
        frontEnd: true,
        language: 'CSS'
      },
      {
        name: 'LESS',
        frontEnd: true,
        language: 'CSS'
      },









    ], {});



  },

  down: function (queryInterface, Sequelize) {
    /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.bulkDelete('Person', null, {});
     */
    return queryInterface.bulkDelete('skills', null, {});

  }
};
