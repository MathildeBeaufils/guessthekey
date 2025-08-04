const mongoose = require('mongoose');

const parametresSchema = mongoose.Schema({
  son: String,
  theme_couleur: String,
});

const inventaireSchema = mongoose.Schema({
objetsAcquis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'store' }]
})

const userSchema = mongoose.Schema({
  username: String,
  created_at: Date,
  email: String,
  token: String,
  password: String,
  isAdmin: Boolean,
  nbVictoire: Number,
  keyPoint: Number,
  itemTete: String,
  itemTorse: String,
  itemJambes: String,
  itemPieds: String,
  missionsCampagne: [{ type: mongoose.Schema.Types.ObjectId, ref: 'missionsCampagne' }],
  parametres: parametresSchema,
  inventaire: inventaireSchema,
  quetes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quetes' }],
});

const User = mongoose.model('users', userSchema);

module.exports = User;