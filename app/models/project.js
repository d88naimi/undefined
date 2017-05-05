/**
 * Created by Hyungwu Pae on 5/3/17.
 */

module.exports = function(sequelize, DataTypes) {
  const Project = sequelize.define('Project', {

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    githubRepo: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      validate: {
        len: [5, 150],
        isUrl: true
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      validate: {
        len: [2, 150]
      }
    },
    teamMate: {
      type: DataTypes.STRING, //jSON
      defaultValue: null,
      allowNull: true
    },
    screenshot: {
      type: DataTypes.STRING, // JSON
      defaultValue: null,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasGithubRepo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    forksCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    stargazersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    watchersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

  }, {
    classMethods: {
      associate: function(models) {
        Project.belongsTo(models.User, {
          foreignKey: {
            allowNull: false,
            name: `user`
          }
        });

        Project.belongsToMany(models.Skill, {
          through: `ProjectSkills`,
          foreignKey: `projectId`,
          as: `skills`
        });
      }
    }
  });

  return Project;
};
