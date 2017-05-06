'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.describeTable('projects').then(function(attributes) {
      if(!attributes.hasOwnProperty('showToPublic')) {
        return queryInterface.addColumn(
          'projects',
          'showToPublic',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          }
        );
      }
    });





  },

  down: function (queryInterface, Sequelize) {
    /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.dropTable('users');
     */
  }
};
