const models = require('../../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
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
