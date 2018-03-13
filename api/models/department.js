'use strict';
module.exports = function(sequelize, DataTypes) {
  var Department = sequelize.define('Department', {
    code: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    color: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    duration1: DataTypes.INTEGER,
    duration2: DataTypes.INTEGER,
    duration3: DataTypes.INTEGER,
    seminarsCount: DataTypes.INTEGER,
    halfDuration: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Department;
};
