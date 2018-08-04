'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ukmppd = sequelize.define('Ukmppd', {
    testNumber: DataTypes.STRING,
    score: DataTypes.FLOAT,
    testDate: DataTypes.DATEONLY,
    selected: DataTypes.BOOLEAN,
    testType: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Ukmppd.associate = function (models) {
    Ukmppd.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return Ukmppd;
};
