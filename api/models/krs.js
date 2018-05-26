'use strict';
module.exports = function(sequelize, DataTypes) {
  var Krs = sequelize.define('Krs', {
    paid: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    description: DataTypes.STRING,
    paymentDate: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Krs.associate = function (models) {
    Krs.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return Krs;
};
