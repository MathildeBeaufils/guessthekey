const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');
const generateLobbyCode = require('../utils/generateLobbyCode');

// création lobby 
router.post('/create', async (req, res) => {
  let code;
  let existingLobby;
  do {
    code = generateLobbyCode();
    existingLobby = await Lobby.findOne({ code });
  } while (existingLobby);

  const lobby = new Lobby({ code, players: [] });
  await lobby.save();

  res.json({ result: true, code });
});

// route POST pour rejoindre un lobby par son code
router.post('/join', (req, res) => {
  const { code, username } = req.body;

  if (!code || code.length !== 6) {
    return res.status(400).json({ result: false, message: 'Code invalide' });
  }

  Lobby.findOne({ code: code.toUpperCase() })
    .then(lobby => {
      if (!lobby) {
        return res.status(404).json({ result: false, message: 'Lobby non trouvé' });
      }

  const alreadyInLobby = lobby.players.some(
    player => player.username.toLowerCase() === username.toLowerCase()
  );

  if (!alreadyInLobby) {
    lobby.players.push({ username });
    return lobby.save().then(() => {
      res.json({ result: true, message: 'Lobby rejoint', code: lobby.code });
    });
  } else {
    res.json({ result: true, message: 'Déjà dans le lobby', code: lobby.code });
  }
  
})
.catch(err => {
  console.error('Erreur lors de la recherche du lobby :', err);
  res.status(500).json({ result: false, message: 'Erreur serveur' });
});
});

module.exports = router;