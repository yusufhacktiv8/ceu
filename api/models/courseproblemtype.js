'use strict';
module.exports = function(sequelize, DataTypes) {
  var CourseProblemType = sequelize.define('CourseProblemType', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CourseProblemType;
};