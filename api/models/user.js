'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  User.associate = function (models) {
    User.belongsTo(models.Role, { onDelete: 'restrict' });
  };

  return User;
};
