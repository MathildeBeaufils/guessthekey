const express = require('express');
const router = express.Router();
// Générateur de noms de lobbies
const { nanoid } = require('nanoid');

// Route POST qui crée un lobby et retourne un nom unique
router.post('/', (req, res) => {
    const lobbyId = 'Lobby-' + nanoid(6); // Ex: Lobby-3f9K2d
    res.json({ lobbyId });
});

module.exports = router;
