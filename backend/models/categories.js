const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
    nom: String,
    image: String,
    created_at: Date,
});

const Categorie = mongoose.model('categories', categoriesSchema);