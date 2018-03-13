'use strict';
module.exports = function(sequelize, DataTypes) {
  var PortofolioType = sequelize.define('PortofolioType', {
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

  PortofolioType.associate = function (models) {
    PortofolioType.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return PortofolioType;
};
