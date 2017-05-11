'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.describeTable('projects').then(function(attributes) {
      if(!attributes.hasOwnProperty('thumbnail')) {
        return queryInterface.addColumn(
          'projects',
          'thumbnail',
          {
            type: Sequelize.STRING,
            defaultValue: null
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
