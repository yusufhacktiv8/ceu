'use strict';
module.exports = function(sequelize, DataTypes) {
  var Hospital = sequelize.define('Hospital', {
    code: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    hospitalType: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Hospital.associate = function (models) {
    Hospital.hasMany(models.HospitalDepartment);
  };

  return Hospital;
};
