const db = require("../models");
const NationalData = db.nationalData;

const moment = require('moment-timezone');
moment.locale('it');
moment.tz.setDefault('Europe/Rome');

// Retrieve all NationalDatas from the database.
exports.findAll = (req, res) => {
  const condition = {};

  const page = req.query.page ? req.query.page : 1;

  const paginateOptions = {
    sort: { data: -1 },
    page: page,
    limit: 15,
    collation: {
      locale: 'it'
    }
  };

  const from = req.query.from;
  if (from) {
    condition.data = {
      $gte: moment(from).format('YYYY-MM-DD')
    }
  }

  const to = req.query.to;
  if (to) {
    let date = moment(to).format('YYYY-MM-DD');
    let dayAfter = moment(date).add(1, 'day').format('YYYY-MM-DD');
    condition.data = {
      $lte: dayAfter
    }
  }

  if (from && to) {
    let date = moment(to).format('YYYY-MM-DD');
    let dayAfter = moment(date).add(1, 'day').format('YYYY-MM-DD');
    condition.data = {
      $gte: moment(from).format('YYYY-MM-DD'),
      $lte: dayAfter
    }
  }

  NationalData.paginate(condition, paginateOptions)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single NationalData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  NationalData.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found NationalData with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving NationalData with id=" + id });
    });
};

exports.average = (req, res) => {
  const condition = {};

  const from = req.query.from;
  if (from) {
    condition.data = {
      $gte: moment(from).format('YYYY-MM-DD')
    }
  }

  const to = req.query.to;
  if (to) {
    let date = moment(to).format('YYYY-MM-DD');
    let dayAfter = moment(date).add(1, 'day').format('YYYY-MM-DD');
    condition.data = {
      $lte: dayAfter
    }
  }

  if (from && to) {
    let date = moment(to).format('YYYY-MM-DD');
    let dayAfter = moment(date).add(1, 'day').format('YYYY-MM-DD');
    condition.data = {
      $gte: moment(from).format('YYYY-MM-DD'),
      $lte: dayAfter
    }
  }

  NationalData.aggregate([
    {
      $group: {
        _id: "ITA",
        media_totale_positivi : { $avg: "$totale_positivi" },
        media_dimessi_guariti : { $avg: "$dimessi_guariti" },
        media_deceduti : { $avg: "$deceduti" },
      },
    }
  ])
    .then(data => {
      delete data[0]._id
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};