const Excel = require('exceljs');
const models = require('../../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

const getCriteriaByScore = (scores) => {
  const score1Arr = scores.filter(score => score.ScoreType.code === 'PRETEST');
  const score1 = score1Arr.length > 0 ? score1Arr[0].scoreValue : null;
  const score1Percentage = score1 ? score1 * 0 : null;

  const score2Arr = scores.filter(score => score.ScoreType.code === 'CASEREPORT');
  const score2 = score2Arr.length > 0 ? score2Arr[0].scoreValue : null;
  const score2Percentage = score2 ? score2 * 0.1 : null;

  const score3Arr = scores.filter(score => score.ScoreType.code === 'WEEKLYDISCUSSION');
  const score3 = score3Arr.length > 0 ? score3Arr[0].scoreValue : null;
  const score3Percentage = score3 ? score3 * 0.2 : null;

  const score4Arr = scores.filter(score => score.ScoreType.code === 'CASETEST');
  const score4 = score4Arr.length > 0 ? score4Arr[0].scoreValue : null;
  const score4Percentage = score4 ? score4 * 0.35 : null;

  const score5Arr = scores.filter(score => score.ScoreType.code === 'POSTTEST');
  const score5 = score5Arr.length > 0 ? score5Arr[0].scoreValue : null;
  const score5Percentage = score5 ? score5 * 0.35 : null;

  const totalPercentage = score1Percentage + score2Percentage + score3Percentage
  + score4Percentage + score5Percentage;

  const total = score1 + score2 + score3
  + score4 + score5;

  let totalInCriteria = null;
  const totalPercentageRound = totalPercentage; // mathjs.round(totalPercentage, 2);
  if (totalPercentageRound >= 80 && totalPercentageRound <= 100) {
    totalInCriteria = 'A';
  } else if (totalPercentageRound >= 70 && totalPercentageRound <= 79) {
    totalInCriteria = 'B';
  } else if (totalPercentageRound >= 60 && totalPercentageRound <= 69) {
    totalInCriteria = 'C';
  } else if (totalPercentageRound > 0 && totalPercentageRound <= 59) {
    totalInCriteria = 'E';
  } else if (totalPercentageRound <= 0) {
    totalInCriteria = '-';
  }

  return {
    totalPercentage,
    total,
    totalInCriteria,
  };
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchDepartment = req.query.searchDepartment;
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

  const departmentWhere = {};
  if (searchDepartment) {
    departmentWhere.id = searchDepartment;
  }

  models.Course.findAndCountAll({
    distinct: true,
    where: {},
    include: [
      {
        model: models.Student,
        required: true,
        where: studentWhere,
      },
      {
        model: models.Department,
        required: true,
        where: departmentWhere,
      },
      {
        model: models.Score,
        include: [
          {
            model: models.ScoreType,
          },
        ],
      },
      {
        model: models.Hospital,
        as: 'hospital1',
      },
      {
        model: models.Hospital,
        as: 'clinic',
      },
      {
        model: models.Docent,
        as: 'adviser',
      },
      {
        model: models.Docent,
        as: 'examiner',
      },
    ],
    limit,
    offset,
  })
  .then((roles) => {
    res.json(roles);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.download = function download(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchDepartment = req.query.searchDepartment;

  const studentWhere = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  const departmentWhere = {};
  if (searchDepartment) {
    departmentWhere.id = searchDepartment;
  }

  models.Course.findAll({
    distinct: true,
    where: {},
    include: [
      {
        model: models.Student,
        required: true,
        where: studentWhere,
      },
      {
        model: models.Department,
        required: true,
        where: departmentWhere,
      },
      {
        model: models.Score,
        include: [
          {
            model: models.ScoreType,
          },
        ],
      },
      {
        model: models.Hospital,
        as: 'hospital1',
      },
      {
        model: models.Hospital,
        as: 'clinic',
      },
      {
        model: models.Docent,
        as: 'adviser',
      },
      {
        model: models.Docent,
        as: 'examiner',
      },
    ],
  })
  .then((courses) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.getCell('A1').value = 'No';
    sheet.getCell('B1').value = 'Nama';
    sheet.getCell('C1').value = 'Stambuk Lama';
    sheet.getCell('D1').value = 'Stambuk Baru';
    sheet.getCell('E1').value = 'Departemen';
    sheet.getCell('F1').value = 'Rumah Sakit';
    sheet.getCell('G1').value = 'Puskesmas';
    sheet.getCell('H1').value = 'Pembimbing';
    sheet.getCell('I1').value = 'Penguji';
    sheet.getCell('J1').value = 'Nilai';
    sheet.getCell('K1').value = 'Nilai (Persentase)';
    sheet.getCell('L1').value = 'Kriteria';

    for (let i = 0; i < courses.length; i += 1) {
      sheet.getCell(`A${i+2}`).value = i + 1;
      sheet.getCell(`B${i+2}`).value = courses[i].Student.name;
      sheet.getCell(`C${i+2}`).value = courses[i].Student.oldSid;
      sheet.getCell(`D${i+2}`).value = courses[i].Student.newSid;
      sheet.getCell(`E${i+2}`).value = courses[i].Department.name;
      sheet.getCell(`F${i+2}`).value = courses[i].hospital1 ? courses[i].hospital1.name : '-';
      sheet.getCell(`G${i+2}`).value = courses[i].clinic ? courses[i].clinic.name : '-';
      sheet.getCell(`H${i+2}`).value = courses[i].adviser ? courses[i].adviser.name : '-';
      sheet.getCell(`I${i+2}`).value = courses[i].examiner ? courses[i].examiner.name : '-';
      const criteriaByScore = getCriteriaByScore(courses[i].Scores);
      sheet.getCell(`J${i+2}`).value = criteriaByScore.totalPercentage;
      sheet.getCell(`K${i+2}`).value = criteriaByScore.total;
      sheet.getCell(`L${i+2}`).value = criteriaByScore.totalInCriteria;
    }

    // res.setContentType('application/vnd.ms-excel');
    res.setHeader('Content-disposition', 'attachment; filename=score.xlsx');

    workbook.xlsx.write(res)
      .then(function() {
          // done
      });
  });
};
