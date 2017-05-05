/**
 * Created by Hyungwu Pae on 5/3/17.
 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const Skill = sequelize.define('Skill', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {

        Skill.belongsToMany(models.Project, {
          through: `ProjectSkills`,
          foreignKey: `skillId`,
          as: `projects`
        });
      }
    }

  });

  return Skill;
};
