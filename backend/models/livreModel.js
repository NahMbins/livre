
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  auteur: {
    type: String,
    required: true,
  },
  date_sortie: {
    type: Date,
    required: true,
  },
  nb_page: {
    type: Number,
    required: true,
  },
});

const Livre = mongoose.model('Livre', Schema);

module.exports = Livre;
