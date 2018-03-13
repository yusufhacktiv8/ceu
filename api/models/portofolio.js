'use strict';
module.exports = function(sequelize, DataTypes) {
  var Portofolio = sequelize.define('Portofolio', {
    portofolioDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Portofolio.associate = function (models) {
    Portofolio.belongsTo(models.Course, { onDelete: 'restrict' });
    Portofolio.belongsTo(models.PortofolioType, { onDelete: 'restrict' });
  };
  return Portofolio;
};
