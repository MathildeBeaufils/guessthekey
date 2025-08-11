const mongoose = require('mongoose');

const MissionsSchema = new mongoose.Schema({
    nom: String,
    image: String,
    difficulte: String,
    terminee: Boolean,
    manches: { type: mongoose.Schema.Types.ObjectId, ref: "manches" },
});

const Mission = mongoose.model('missions', MissionsSchema);

module.exports = Mission;
