module.exports = app => {
  const regionalData = require("../controllers/regional.data.controller.js");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", regionalData.findAll);

  router.get("/worst", regionalData.findWorstRegions);

  router.get("/avg", regionalData.average);
  router.get("/region/:regionCode", regionalData.findByRegion);

  // Retrieve a single Tutorial with id
  router.get("/:id", regionalData.findOne);


  app.use('/api/regional_data', router);
};