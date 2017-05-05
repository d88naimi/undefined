'use strict';

const crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {

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
          name: this.name,
          profileUrl: this.profileUrl,
          photo: this.photo,
          githubId: this.githubId
        };
      }
    },
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Project);
      }
    }

  });

  return User;
};
