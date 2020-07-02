module.exports = app => {
  const nationalData = require("../controllers/national.data.controller.js");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", nationalData.findAll);

  router.get("/avg", nationalData.average);

  // Retrieve a single Tutorial with id
  router.get("/:id", nationalData.findOne);

  app.use('/api/national_data', router);
};