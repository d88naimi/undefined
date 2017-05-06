/**
 * Created by Hyungwu Pae on 5/3/17.
 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const Skill = sequelize.define('skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 150]
      }
    },
    frontEnd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    backEnd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    database: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    android: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ios: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    language: {
      type:   DataTypes.ENUM,
      allowNull: true,
      defaultValue: null,
<<<<<<< HEAD
      values: ['Javascript', 'Java', 'Python', 'PHP',
        'CSS', 'Ruby', 'C++', 'C', 'Shell', 'C#', 'Objective C',
=======
      values: ['Javascript', 'Java', 'Python', 'CSS', 'PHP',
        'Ruby', 'C++', 'C', 'Shell', 'C#', 'Objective C',
>>>>>>> master
        'R', 'Viml', 'Go', 'Perl', 'CoffeeScript', 'Tex', 'Swift',
        'Scala', 'Emacs Lisp', 'Haskell', 'Lua', 'Clojure',
        'Matlab', 'Arduino', 'Makefile', 'Groovy', 'Puppet', 'Rust', 'PowerShell']
    }
  }, {
    classMethods: {
      associate: function (models) {

        Skill.belongsToMany(models.project, {
          through: `projectskills`,
          foreignKey: `skillId`,
          as: { singular: `project`, plural: `projects` }
        });
      }
    }

  });

  return Skill;
};
