'use strict';
module.exports = function(sequelize, DataTypes) {
  var MidKompreCandidate = sequelize.define('MidKompreCandidate', {
    testDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  MidKompreCandidate.associate = function (models) {
    MidKompreCandidate.belongsTo(models.Student, { onDelete: 'restrict' });
  };

  return MidKompreCandidate;
};
