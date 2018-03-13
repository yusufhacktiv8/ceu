'use strict';
module.exports = function(sequelize, DataTypes) {
  var KompreType = sequelize.define('KompreType', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return KompreType;
};