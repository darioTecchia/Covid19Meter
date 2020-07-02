module.exports = app => {
  const provincialData = require("../controllers/provincial.data.controllers.js");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", provincialData.findAll);

  // Retrieve a single Tutorial with id
  
  router.get("/avg", provincialData.average);
  router.get("/province/:provinceCode", provincialData.findByProvince);
  router.get("/:id", provincialData.findOne);

  app.use('/api/provincial_data', router);
};