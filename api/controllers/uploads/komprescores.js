const Excel = require('exceljs');
const Readable = require('stream').Readable;
const moment = require('moment');
const models = require('../../models');
const Constant = require('../../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchKompreType = req.query.searchKompreType;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const studentWhere = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  const kompreTypeWhere = {};
  if (searchKompreType) {
    kompreTypeWhere.id = searchKompreType;
  }

  models.Kompre.findAndCountAll({
    // where: {},
    include: [
      {
        model: models.Student,
        required: true,
        where: studentWhere,
      },
      {
        model: models.KompreType,
        required: true,
        where: kompreTypeWhere,
      },
    ],
    limit,
    offset,
  })
  .then((kompres) => {
    res.json(kompres);
  });
};

exports.create = function create(req, res) {
  const kompreForm = req.body;
  const studentId = parseInt(kompreForm.student, 10);
  const kompreTypeId = parseInt(kompreForm.kompreType, 10);

  models.Kompre.create({
    ...kompreForm,
    StudentId: studentId,
    KompreTypeId: kompreTypeId,
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error when doing operation.');
  });
};

exports.update = function update(req, res) {
  const kompreForm = req.body;
  kompreForm.KompreTypeId = parseInt(kompreForm.kompreType, 10);
  models.Kompre.update(
    kompreForm,
    {
      where: { id: req.params.kompreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Kompre.destroy(
    {
      where: { id: req.params.kompreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.upload = function upload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "kompreFile") is used to retrieve the uploaded file
  const kompreFile = req.files.kompreFile;

  // Use the mv() method to place the file somewhere on your server
  const firstLineIndex = 2;
  const uploadTypeIndex = 'B';
  const newSidIndex = 'C';
  const kompreDateIndex = 'D';
  const kompreValueIndex = 'F';

  const workbook = new Excel.Workbook();
  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(kompreFile.data);
  stream.push(null);
  workbook.xlsx.read(stream)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        const promises = [];

        for (let i = firstLineIndex; i <= Constant.MAX_SCORE_UPLOADED_ROW + firstLineIndex; i += 1) {
          const uploadType = worksheet.getCell(`${uploadTypeIndex}${i}`).value;
          const newSid = String(worksheet.getCell(`${newSidIndex}${i}`).value);
          const kompreDate = moment(worksheet.getCell(`${kompreDateIndex}${i}`).value, 'DD/MM/YYYY HH:mm:ss').toDate();
          const kompreValue = parseFloat(worksheet.getCell(`${kompreValueIndex}${i}`).value);

          const promise = new Promise((resolve, reject) => {
            models.Kompre.findOne({
              where: {},
              include: [
                {
                  model: models.Student,
                  where: {
                    newSid,
                  },
                },
                {
                  model: models.KompreType,
                  where: {
                    code: uploadType,
                  },
                },
              ],
            }).then((foundKompre) => {
              if (foundKompre) {
                foundKompre.kompreValue = kompreValue;
                foundKompre.kompreDate = kompreDate;
                foundKompre.save()
                .then(() => {
                  resolve({ newSid, found: true });
                });
              } else {
                models.Student.findOne({
                  where: {
                    newSid,
                  },
                })
                .then((foundStudent) => {
                  if (foundStudent) {
                    models.KompreType.findOne({
                      where: {
                        code: uploadType,
                      },
                    })
                    .then((foundKompreType) => {
                      models.Kompre.create({
                        kompreValue,
                        kompreDate,
                        StudentId: foundStudent.id,
                        KompreTypeId: foundKompreType.id,
                      })
                      .then(() => {
                        resolve({ newSid, found: true });
                      });
                    });
                  } else {
                    resolve({ newSid, found: false });
                  }
                });
              }
            })
            .catch((errFindCourse) => {
              reject(errFindCourse);
            });
          });

          promises.push(promise);
        }

        Promise.all(promises)
        .then((uploadResult) => {
          res.json(uploadResult);
        });
      })
      .catch((errReadExcel) => {
        res.status(500).send(errReadExcel.message);
      });
};

exports.download = function download(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchKompreType = req.query.searchKompreType;

  const studentWhere = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  const kompreTypeWhere = {};
  if (searchKompreType) {
    kompreTypeWhere.id = searchKompreType;
  }

  models.Kompre.findAll({
    // where: {},
    include: [
      {
        model: models.Student,
        required: true,
        where: studentWhere,
      },
      {
        model: models.KompreType,
        required: true,
        where: kompreTypeWhere,
      },
    ],
  })
  .then((kompres) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.getCell('A1').value = 'No';
    sheet.getCell('B1').value = 'Tipe';
    sheet.getCell('C1').value = 'Nama';
    sheet.getCell('D1').value = 'Stambuk Lama';
    sheet.getCell('E1').value = 'Stambuk Baru';
    sheet.getCell('F1').value = 'Nilai';
    sheet.getCell('G1').value = 'Tanggal';

    for (let i = 0; i < kompres.length; i += 1) {
      sheet.getCell(`A${i+2}`).value = i + 1;
      sheet.getCell(`B${i+2}`).value = kompres[i].KompreType.code;
      sheet.getCell(`C${i+2}`).value = kompres[i].Student.name;
      sheet.getCell(`D${i+2}`).value = kompres[i].Student.oldSid;
      sheet.getCell(`E${i+2}`).value = kompres[i].Student.newSid;
      sheet.getCell(`F${i+2}`).value = kompres[i].kompreValue;
      sheet.getCell(`G${i+2}`).value = moment(kompres[i].kompreDate).format('DD/MM/YYYY')
    }

    // res.setContentType('application/vnd.ms-excel');
    res.setHeader('Content-disposition', 'attachment; filename=kompre.xlsx');

    workbook.xlsx.write(res)
      .then(function() {
          // done
      });
  });
};
