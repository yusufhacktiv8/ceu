'use strict';
module.exports = function(sequelize, DataTypes) {
  var AssistanceParticipant = sequelize.define('AssistanceParticipant', {
    fileCode: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  AssistanceParticipant.associate = function (models) {
    AssistanceParticipant.belongsTo(models.Student, { onDelete: 'restrict' });
    AssistanceParticipant.belongsTo(models.Assistance, { onDelete: 'restrict' });
  };

  return AssistanceParticipant;
};
