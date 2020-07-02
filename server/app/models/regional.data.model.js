const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = mongoose => {
  var schema = mongoose.Schema({
    data: String,
    stato: String,
    codice_regione: Number,
    denominazione_regione: String,
    lat: Number,
    long: Number,
    ricoverati_con_sintomi: Number,
    terapia_intensiva: Number,
    totale_ospedalizzati: Number,
    isolamento_domiciliare: Number,
    totale_positivi: Number,
    variazione_totale_positivi: Number,
    nuovi_positivi: Number,
    dimessi_guariti: Number,
    deceduti: Number,
    totale_casi: Number,
    tamponi: Number,
    casi_testati: Number,
    note_it: String,
    note_en: String
  });

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  schema.index({ data: 1 }, { unique: true });

  schema.index({ codice_regione: 1 });
  schema.index({ denominazione_regione: 1 });

  const RegionalData = mongoose.model("regional_data", schema);
  return RegionalData;
};