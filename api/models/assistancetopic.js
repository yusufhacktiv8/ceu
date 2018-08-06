'use strict';
module.exports = function(sequelize, DataTypes) {
  var AssistanceTopic = sequelize.define('AssistanceTopic', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  AssistanceTopic.associate = function (models) {
    AssistanceTopic.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return AssistanceTopic;
};
