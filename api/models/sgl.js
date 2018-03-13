'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sgl = sequelize.define('Sgl', {
    sglDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
    mainTutorPresent: DataTypes.BOOLEAN,
    secondTutorPresent: DataTypes.BOOLEAN,
    thirdTutorPresent: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Sgl.associate = function (models) {
    Sgl.belongsTo(models.Course, { onDelete: 'restrict' });
    Sgl.belongsTo(models.SglType, { onDelete: 'restrict' });
    Sgl.belongsTo(models.Pengampu, { as: 'mainTutor', onDelete: 'restrict' });
    Sgl.belongsTo(models.Pengampu, { as: 'secondTutor', onDelete: 'restrict' });
    Sgl.belongsTo(models.Pengampu, { as: 'thirdTutor', onDelete: 'restrict' });
  };

  return Sgl;
};
