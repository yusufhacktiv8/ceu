'use strict';
module.exports = function(sequelize, DataTypes) {
  var StudentUser = sequelize.define('StudentUser', {
    code: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  StudentUser.associate = function (models) {
    StudentUser.belongsTo(models.User, { onDelete: 'restrict' });
    StudentUser.belongsTo(models.Student, { onDelete: 'restrict' });
  };
  return StudentUser;
};
