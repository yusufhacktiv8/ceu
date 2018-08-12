'use strict';
module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    oldSid: { type: DataTypes.STRING, unique: true },
    newSid: { type: DataTypes.STRING, unique: true },
    level: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    mobilePhone: DataTypes.STRING,
    email: DataTypes.STRING,
    enrollYear: DataTypes.INTEGER,
    graduateYear: DataTypes.INTEGER,
    certificateNumber: DataTypes.STRING,
    status: DataTypes.STRING,
    ipk: DataTypes.DOUBLE,
    krs: DataTypes.BOOLEAN,
    krsFileId: DataTypes.STRING,
    spp: DataTypes.BOOLEAN,
    sppFileId: DataTypes.STRING,
    ijazah: DataTypes.BOOLEAN,
    ijazahFileId: DataTypes.STRING,
    ijazahAkhir: DataTypes.BOOLEAN,
    ijazahAkhirFileId: DataTypes.STRING,
    fatherName: DataTypes.STRING,
    motherName: DataTypes.STRING,
    parentAddress: DataTypes.STRING,
    parentPhone: DataTypes.STRING,
    parentMobilePhone: DataTypes.STRING,
    yudisiumCheck: DataTypes.BOOLEAN,
    ukmppdCheck: DataTypes.BOOLEAN,
    midKomprePass: DataTypes.BOOLEAN,

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  Student.associate = function (models) {
    Student.hasMany(models.Course);
  };

  return Student;
};
