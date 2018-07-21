'use strict';
module.exports = function(sequelize, DataTypes) {
  var YudisiumChecklist = sequelize.define('YudisiumChecklist', {
    checklist1: DataTypes.BOOLEAN,
    checklist2: DataTypes.BOOLEAN,
    checklist3: DataTypes.BOOLEAN,
    yudisiumDate: DataTypes.DATEONLY,
    yudisiumPass: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  YudisiumChecklist.associate = function (models) {
    YudisiumChecklist.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return YudisiumChecklist;
};
