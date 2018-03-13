'use strict';
module.exports = function(sequelize, DataTypes) {
  var ScoreType = sequelize.define('ScoreType', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ScoreType;
};