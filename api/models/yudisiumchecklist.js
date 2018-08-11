'use strict';
module.exports = function(sequelize, DataTypes) {
  var YudisiumChecklist = sequelize.define('YudisiumChecklist', {
    checklist1: DataTypes.BOOLEAN,
    checklist2: DataTypes.BOOLEAN,
    checklist3: DataTypes.BOOLEAN,
    yudisiumDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
    checklist1B: DataTypes.BOOLEAN,
    checklist2B: DataTypes.BOOLEAN,
    checklist3B: DataTypes.BOOLEAN,
    checklist4B: DataTypes.BOOLEAN,
    yudisiumDateB: DataTypes.DATEONLY,
    completedB: DataTypes.BOOLEAN,
    assistanceCompleted: DataTypes.BOOLEAN,
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
