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
      {
        name: 'jQuery',
        frontEnd: true,
        language: 'Javascript'
      },
      {
        name: 'Angular',
        frontEnd: true,
        language: 'Javascript'
      },
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
        name: 'Django',
        backEnd: true,
        language: 'Python'
      },
      {
        name: 'React',
        frontEnd: true
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
      {
        name: 'Express',
        backEnd: true,
        language: 'Javascript'
      },
      {
        name: 'ES6',
      },
      {
        name: 'Typescript',
        language: 'Javascript'
      },
      {
        name: 'Firebase',
        backEnd: true,
        database: true
      }
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
