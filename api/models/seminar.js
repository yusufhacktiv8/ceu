'use strict';
module.exports = function(sequelize, DataTypes) {
  var Seminar = sequelize.define('Seminar', {
    code: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    eventDate: DataTypes.DATEONLY,
    eventTime: DataTypes.TIME,
    description: DataTypes.STRING,
    duration: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Seminar.associate = function (models) {
    Seminar.hasMany(models.Participant);
    Seminar.belongsTo(models.SeminarType, { onDelete: 'restrict' });
    Seminar.belongsTo(models.Supervisor, { as: 'speaker', onDelete: 'restrict' });
    Seminar.belongsTo(models.Supervisor, { as: 'moderator', onDelete: 'restrict' });
  };

  return Seminar;
};
