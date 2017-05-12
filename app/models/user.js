'use strict';

const crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {

    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email address is already in use.'
      },
      validate: {
        isEmail: true
      }
    },
    profileUrl: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    githubId: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    githubUsername:{
      type: DataTypes.STRING,
      defaultValue: null
    },
  }, {

    getterMethods: {
      // Public profile
      profile() {
        return {
          id: this.id,
          name: this.name,
          profileUrl: this.profileUrl,
          photo: this.photo,
          githubUsername: this.githubUsername
        };
      }
    },
    classMethods: {
      // associate: function (models) {
      //   User.hasMany(models.project);
      // }
    }

  });

  return User;
};
