const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = mongoose => {
  var schema = mongoose.Schema({
    data: String,
    stato: String,
    codice_regione: Number,
    denominazione_regione: String,
    codice_provincia: Number,
    denominazione_provincia: String,
    sigla_provincia: String,
    lat: Number,
    long: Number,
    totale_casi: Number,
    note_it: String
  });

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  schema.index({ data: 1 }, { unique: true });

  schema.index({ codice_regione: 1 });
  schema.index({ denominazione_regione: 1 });

  schema.index({ codice_provincia: 1 });
  schema.index({ denominazione_provincia: 1 });

  const ProvincialData = mongoose.model("provincial_data", schema);
  return ProvincialData;
};