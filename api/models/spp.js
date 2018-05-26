'use strict';
module.exports = function(sequelize, DataTypes) {
  var Spp = sequelize.define('Spp', {
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

  Spp.associate = function (models) {
    Spp.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return Spp;
};
