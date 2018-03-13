'use strict';
module.exports = function(sequelize, DataTypes) {
  var AppProp = sequelize.define('AppProp', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    stringValue: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AppProp;
};