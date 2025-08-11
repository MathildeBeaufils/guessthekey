const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  players: [{username: { type: String }}],
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // 1h expiration
  state: String,
});

module.exports = mongoose.model('Lobby', LobbySchema);