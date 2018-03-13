'use strict';
module.exports = function(sequelize, DataTypes) {
  var HospitalDepartment = sequelize.define('HospitalDepartment', {
    quota: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  HospitalDepartment.associate = function (models) {
    HospitalDepartment.belongsTo(models.Hospital, { onDelete: 'restrict' });
    HospitalDepartment.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return HospitalDepartment;
};
