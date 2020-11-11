const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema and Model

const MeteoSchema=new Schema({
    data: String,
    vento: String
});

const Meteo = mongoose.Smodel('meteo', MeteoSchema);

module.exports = Meteo;
