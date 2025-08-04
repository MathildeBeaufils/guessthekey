const mongoose = require('mongoose');

const quetesSchema = mongoose.Schema({
  nom: String,
  objectif: String,
});

const Quete = mongoose.model('quetes', quetesSchema);

module.exports = Quete;