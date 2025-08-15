const mongoose = require("mongoose");

const parametresSchema = mongoose.Schema({
  son: String,
  theme_couleur: String,
});

const inventaireSchema = mongoose.Schema({
  objetsAcquis: [{ type: mongoose.Schema.Types.ObjectId, ref: "store" }],
});

const missionsCampagne_SousDocumentSchema = mongoose.Schema({
  terminee: Boolean,
  nom: String,
  image: String,
  difficulte: String,
  manches: { type: mongoose.Schema.Types.ObjectId, ref: "manches" },
});

const quetes_SousDocumentSchema = mongoose.Schema({
  terminee: Boolean,
  id: Number,
  title: String,
  description: String,
});

const userSchema = mongoose.Schema({
  username: String,
  created_at: Date,
  email: String,
  token: String,
  password: String,
  isSignedUp: Boolean,
  isAdmin: Boolean,
  nbVictoire: Number,
  keyPoint: Number,
  itemTete: String,
  itemTorse: String,
  itemJambes: String,
  itemPieds: String,
  tableauMissionsCampagne: [missionsCampagne_SousDocumentSchema],
  tableauQuete:[quetes_SousDocumentSchema],
  parametres: parametresSchema,
  inventaire: inventaireSchema,
  
});

const User = mongoose.model("users", userSchema);

module.exports = User;
