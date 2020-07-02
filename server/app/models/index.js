const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.url = dbConfig.url;

db.nationalData = require("./national.data.model.js")(mongoose);
db.provincialData = require("./provincial.data.model.js")(mongoose);
db.regionalData = require("./regional.data.model.js")(mongoose);

module.exports = db;