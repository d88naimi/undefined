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
        name: 'Photoshop',
        frontEnd: true,
      },{
        name: 'GIMP',
        frontEnd: true,
      },{
        name: 'SketchBook',
        frontEnd: true,
      },{
        name: 'Pixelmator',
        frontEnd: true,
        language: 'UI'
      },{
        name: 'Aperture',
        frontEnd: true,
        language: 'UI'
      },


      //Web development platform
      {
        name: 'Word Press',
        frontEnd: true
      },
      {
        name: 'Drupal',
        frontEnd: true
      },
      {
        name: 'Squarespace',
        frontEnd: true
      },
      {
        name: 'Wix',
        frontEnd: true
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
