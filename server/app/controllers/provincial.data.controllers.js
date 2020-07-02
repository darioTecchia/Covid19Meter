const db = require("../models");
const ProvincialData = db.provincialData;
const RegionalData = db.regionalData;

const moment = require('moment-timezone');
moment.locale('it');
moment.tz.setDefault('Europe/Rome');

// Retrieve all ProvincialDatas from the database.
exports.findAll = (req, res) => {
  const condition = {};

  const page = req.query.page ? req.query.page : 1;

  const paginateOptions = {
    sort: { data: -1 },
    page: page,
    limit: 10,
    collation: {
      locale: 'it'
    }
  };

  const codice_regione = req.query.codice_regione;
  if (codice_regione) condition.codice_regione = codice_regione;

  const denominazione_regione = req.query.denominazione_regione;
  if (denominazione_regione) condition.denominazione_regione = denominazione_regione;

  const codice_provincia = req.query.codice_provincia;
  if (codice_provincia) condition.codice_provincia = codice_provincia;

  const denominazione_provincia = req.query.denominazione_provincia;
  if (denominazione_provincia) condition.denominazione_provincia = denominazione_provincia;

  const sigla_provincia = req.query.sigla_provincia;
  if (sigla_provincia) condition.sigla_provincia = sigla_provincia;

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

  ProvincialData.find(condition)
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

// Find a single ProvincialData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ProvincialData.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ProvincialData with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving ProvincialData with id=" + id });
    });
};

exports.findByProvince = (req, res) => {
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
  const provinceCode = req.params.provinceCode;
  condition.sigla_provincia = provinceCode;

  ProvincialData.find(condition)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found RegionalData with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving RegionalData with id=" + id });
    });
};

exports.average = async (req, res) => {
  const condition = {}

  const codice_regione = req.query.codice_regione;
  const sigla_provincia = req.query.sigla_provincia;

  const regionalAvg = await RegionalData.aggregate([
    {
      $group: {
        _id: {
          "codice_regione": "$codice_regione",
          "denominazione_regione": "$denominazione_regione"
        },
        media_totale_positivi : { $avg: "$totale_positivi" },
        media_dimessi_guariti : { $avg: "$dimessi_guariti" },
        media_deceduti : { $avg: "$deceduti" },
      },
    },
  ])

  ProvincialData.aggregate([
    {
      $group: {
        _id: {
          "sigla_provincia": "$sigla_provincia",
          "denominazione_provincia": "$denominazione_provincia",
          "codice_regione": "$codice_regione"
        },
        media_totale_casi: { $avg: "$totale_casi" }
      },
    },
  ])
    .then(data => {
      if (sigla_provincia) {
        data = data.filter((e) => {
          return e._id.sigla_provincia == sigla_provincia
        })
      }
      res.send({
        regionalAverage: regionalAvg.filter((e) => {
          return e._id.codice_regione == data[0]._id.codice_regione
        }),
        provinceAverages: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}