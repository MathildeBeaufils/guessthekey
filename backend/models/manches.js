const mongoose = require('mongoose');

const manchesSchema = mongoose.Schema({
  titre1: String,
  artiste1: String,
  titre2: String,
  artiste2: String,
  titre3: String,
  artiste3: String,
  titre4: String,
  artiste4: String,
  titre5: String,
  artiste5: String,
  key: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
  created_at: Date,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Manche = mongoose.model('manches', manchesSchema);

module.exports = Manche;