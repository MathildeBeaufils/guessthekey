const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
  objet: String,
  categorie: String,
});

const Store = mongoose.model('store', storeSchema);

module.exports = Store;