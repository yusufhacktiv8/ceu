'use strict';
module.exports = function(sequelize, DataTypes) {
  var Supervisor = sequelize.define('Supervisor', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Supervisor;
};