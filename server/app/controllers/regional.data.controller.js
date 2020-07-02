const db = require("../models");
const { paginate } = require("mongoose-paginate-v2");
const RegionalData = db.regionalData;
const NationalData = db.nationalData;

const moment = require('moment-timezone');
moment.locale('it');
moment.tz.setDefault('Europe/Rome');

// Retrieve all RegionalDatas from the database.
exports.findAll = (req, res) => {
  const condition = {};

  const page = req.query.page ? req.query.page : 1;

  const paginateOptions = {
    sort: { data: -1 },
    page: page,
    limit: 22,
    collation: {
      locale: 'it'
    }
  };

  const codice_regione = req.query.codice_regione;
  if (codice_regione) condition.codice_regione = codice_regione;

  const denominazione_regione = req.query.denominazione_regione;
  if (denominazione_regione) condition.denominazione_regione = denominazione_regione;

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

  RegionalData.paginate(condition, paginateOptions)
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

exports.findWorstRegions = async (req, res) => {
  const paginateOptions = {
    sort: { data: -1 },
    page: 1,
    limit: 10,
    collation: {
      locale: 'it'
    }
  };
  let lastNationalData = await NationalData
    .find()
    .sort({ data: -1 });

  const condition = [
    {
      "$group": {
        "_id": {
          'denominazione_regione': "$denominazione_regione",
          "lat": "$lat",
          "long": "$long"
        },
        "numero_contagiati": { "$sum": "$variazione_totale_positivi" }
      },
    },
  ];

  RegionalData.aggregate(condition)
    .addFields({
      percentage: {
        "$divide": ["$numero_contagiati", lastNationalData[0].totale_positivi],
      },
      numero_contagiati_italia: lastNationalData[0].totale_positivi
    })
    .sort({ numero_contagiati: -1 })
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

exports.findByRegion = (req, res) => {
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
  const regionCode = req.params.regionCode;
  condition.codice_regione = regionCode;

  RegionalData.find(condition)
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

  const nationalAverage = await NationalData.aggregate([
    {
      $group: {
        _id: "medie",
        media_totale_positivi : { $avg: "$totale_positivi" },
        media_dimessi_guariti : { $avg: "$dimessi_guariti" },
        media_deceduti : { $avg: "$deceduti" },
      }
    }
  ]);
  delete nationalAverage[0]._id

  console.log(condition);
  

  RegionalData.aggregate([
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
    .then(data => {
      if(codice_regione) {
        data = data.filter((e) => {
          return e._id.codice_regione == codice_regione
        })
      }
      res.send({
        regionalAverages: data,
        nationalAverage: nationalAverage[0]
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

// Find a single RegionalData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  RegionalData.findById(id)
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

