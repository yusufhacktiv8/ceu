'use strict';
module.exports = function(sequelize, DataTypes) {
  var Docent = sequelize.define('Docent', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Docent.associate = function (models) {
    Docent.belongsTo(models.Hospital, { onDelete: 'restrict' });
    Docent.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return Docent;
};
