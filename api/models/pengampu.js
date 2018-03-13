'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pengampu = sequelize.define('Pengampu', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Pengampu.associate = function (models) {
    Pengampu.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return Pengampu;
};
