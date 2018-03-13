'use strict';
module.exports = function(sequelize, DataTypes) {
  var Kompre = sequelize.define('Kompre', {
    score: DataTypes.FLOAT,
    kompreDate: DataTypes.DATEONLY,
    selected: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Kompre.associate = function (models) {
    Kompre.belongsTo(models.Student, { onDelete: 'restrict' });
    Kompre.belongsTo(models.KompreType, { onDelete: 'restrict' });
  };

  return Kompre;
};
