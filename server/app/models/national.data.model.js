const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = mongoose => {
  var schema = mongoose.Schema({
    data: String,
    stato: String,
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

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  schema.index({ data: 1 }, { unique: true });

  const NationalData = mongoose.model("national_data", schema);
  return NationalData;
};