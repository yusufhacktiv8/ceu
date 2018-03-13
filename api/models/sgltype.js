'use strict';
module.exports = function(sequelize, DataTypes) {
  var SglType = sequelize.define('SglType', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  SglType.associate = function (models) {
    SglType.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return SglType;
};
