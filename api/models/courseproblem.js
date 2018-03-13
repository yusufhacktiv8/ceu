'use strict';
module.exports = function(sequelize, DataTypes) {
  var CourseProblem = sequelize.define('CourseProblem', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    problemDate: DataTypes.DATEONLY,
    comment: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  CourseProblem.associate = function (models) {
    CourseProblem.belongsTo(models.Course, { onDelete: 'restrict' });
    CourseProblem.belongsTo(models.CourseProblemType, { onDelete: 'restrict' });
  };
  return CourseProblem;
};
