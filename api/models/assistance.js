'use strict';
module.exports = function(sequelize, DataTypes) {
  var Assistance = sequelize.define('Assistance', {
    code: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    eventDate: DataTypes.DATEONLY,
    eventTime: DataTypes.TIME,
    description: DataTypes.STRING,
    batch: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    mainTutorPresent: DataTypes.BOOLEAN,
    secondTutorPresent: DataTypes.BOOLEAN,
    thirdTutorPresent: DataTypes.BOOLEAN,
    facilitatorPresent: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Assistance.associate = function (models) {
    Assistance.hasMany(models.AssistanceParticipant);
    Assistance.belongsTo(models.AssistanceTopic, { onDelete: 'restrict' });
    Assistance.belongsTo(models.Tutor, { as: 'mainTutor', onDelete: 'restrict' });
    Assistance.belongsTo(models.Tutor, { as: 'secondTutor', onDelete: 'restrict' });
    Assistance.belongsTo(models.Tutor, { as: 'thirdTutor', onDelete: 'restrict' });
    Assistance.belongsTo(models.Tutor, { as: 'facilitator', onDelete: 'restrict' });
  };

  return Assistance;
};
