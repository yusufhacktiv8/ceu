'use strict';
module.exports = function(sequelize, DataTypes) {
  var YudisiumCandidate = sequelize.define('YudisiumCandidate', {
    yudisiumDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
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
