'use strict';
module.exports = function(sequelize, DataTypes) {
  var YudisiumCandidate = sequelize.define('YudisiumCandidate', {
    testDate: DataTypes.DATEONLY,
    testPassed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  YudisiumCandidate.associate = function (models) {
    YudisiumCandidate.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return YudisiumCandidate;
};
