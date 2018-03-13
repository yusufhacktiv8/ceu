'use strict';
module.exports = function(sequelize, DataTypes) {
  var SeminarType = sequelize.define('SeminarType', {
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

  SeminarType.associate = function (models) {
    SeminarType.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return SeminarType;
};
