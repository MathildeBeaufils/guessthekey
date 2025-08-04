const mongoose = require('mongoose');

const missionsCampagneSchema = mongoose.Schema({
    terminee: Boolean,
    difficulte: String,
    manches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'manches' }],
});

const MissionsCampagne = mongoose.model('missionsCampagne', missionsCampagneSchema);