const { Server } = require('socket.io');

// Simule un appel API à Deezer. Les URL ont une durée de validité limitée. Elles sont donc a récupérer au moment de jouer la manche via l'API track ou artist
function getFiveTracks() {
  const tracks = [
    { trackId: 139470659, title: 'Shape of You', artist: 'Ed Sheeran' },
    { trackId: 908604612, title: 'Blinding Lights', artist: 'The Weeknd' },
    { trackId: 8086136, title: 'Someone Like You', artist: 'Adele' },
    { trackId: 655095912, title: 'Bad Guy', artist: 'Billie Eilish' },
    { trackId: 3329777161, title: 'Peacefield', artist: 'Ghost' }
  ];

  const updateURL = tracks.map((track) => {
    return fetch(`https://api.deezer.com/track/${track.trackId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.preview) {
          return {
            ...track,
            previewUrl: data.preview
          };
        } else {
          console.warn(`Pas de preview pour ${track.title}`);
          return {
            ...track,
            previewUrl: null
          };
        }
      })
      .catch((error) => {
        console.error(`Erreur pour ${track.title}:`, error);
        return {
          ...track,
          previewUrl: null
        };
      });
  });

  return Promise.all(updateURL);
}



module.exports = (serverInstance) => {
    const io = new Server(serverInstance, {
        cors: { origin: '*' }
    });

    const lobbies = new Map();

    io.on('connection', (socket) => {
        console.log('Utilisateur connecté:', socket.id);

        socket.on('joinLobby', (lobbyId) => {
        socket.join(lobbyId);
        if (!lobbies.has(lobbyId)) {
            lobbies.set(lobbyId, {
            players: new Set(),
            status: 'waiting',
            currentRoundIndex: 0,
            roundDuration: 20,
            timeout: null,
            rounds: [],
            scores: new Map()
            });
        console.log(`Nouveau lobby créé: ${lobbyId}`)
        }
        const lobby = lobbies.get(lobbyId);
        lobby.players.add(socket.id);
        console.log(`Utilisateur ${socket.id} a rejoint le lobby ${lobbyId}`);
        });

    socket.on('requestCurrentGameState', (lobbyId) => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;

        if (lobby.status === 'in-game') {
            const round = lobby.rounds[lobby.currentRoundIndex];
            if (round) {
            socket.emit('newRound', {
                index: lobby.currentRoundIndex + 1,
                total: lobby.rounds.length,
                previewUrl: round.previewUrl,
                duration: lobby.roundDuration
            });
            console.log("Emission newRound")
            }
        }
    });

        socket.on('startGame', async (lobbyId) => {
            console.log(`Démarrage de la partie pour le lobby ${lobbyId}`);
            const lobby = lobbies.get(lobbyId);
            if (!lobby || lobby.status === 'in-game') {
                socket.emit('errorMessage', 'Partie déjà en cours ou lobby invalide');
                return;
            }

            const tracks = await getFiveTracks();
            lobby.rounds = tracks.map(track => ({ ...track, answers: new Map() }));
            lobby.currentRoundIndex = 0;
            lobby.status = 'in-game';
            lobby.scores = new Map();
            io.to(lobbyId).emit('gameStarted');
            console.log("Premier round");
            setTimeout(() => launchNextRound(lobbyId), 500);
        });

        socket.on('answer', ({ lobbyId, title, artist }) => {
            const lobby = lobbies.get(lobbyId);
            if (!lobby || lobby.status !== 'in-game') return;
            const round = lobby.rounds[lobby.currentRoundIndex];
            if (!round) return;
            // Permet d'envoyer une réponse même si un seul champ est rempli
            round.answers.set(socket.id, { title: title || '', artist: artist || '' });

            // Vérifie la réponse et envoie uniquement le titre ou l'artiste correct si trouvé
            const correctTitle = round.title ? round.title.toLowerCase() : '';
            const correctArtist = round.artist ? round.artist.toLowerCase() : '';
            const titleAnswer = (title || '').toLowerCase();
            const artistAnswer = (artist || '').toLowerCase();
            const titleOk = titleAnswer.includes(correctTitle);
            const artistOk = artistAnswer.includes(correctArtist);
            let correctAnswer = {};
            if (titleOk) correctAnswer.title = round.title;
            if (artistOk) correctAnswer.artist = round.artist;
            if (titleOk || artistOk) {
                socket.emit('roundEnded', {
                correctAnswer,
                allAnswers: { [socket.id]: { title: title || '', artist: artist || '' } }
                });
            }
        });

        socket.on('disconnect', () => {
        for (const [lobbyId, lobby] of lobbies.entries()) {
            if (lobby.players.has(socket.id)) {
            lobby.players.delete(socket.id);
            if (lobby.players.size === 0) {
                lobbies.delete(lobbyId);
                console.log(`Lobby ${lobbyId} supprimé (vide)`);
            }
            }
        }
        console.log('Joueur déconnecté:', socket.id);
        });
    });

    function launchNextRound(lobbyId) {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        console.log(`Lancement du round ${lobby.currentRoundIndex +1}`)
        if (lobby.currentRoundIndex >= lobby.rounds.length) {
        console.log("Fin de la parite");
        endGame(lobbyId);
        return;
        }

        const round = lobby.rounds[lobby.currentRoundIndex];
        io.to(lobbyId).emit('newRound', {
        index: lobby.currentRoundIndex + 1,
        total: lobby.rounds.length,
        previewUrl: round.previewUrl,
        duration: lobby.roundDuration
        });

        lobby.timeout = setTimeout(() => {
        evaluateRound(lobbyId);
        }, lobby.roundDuration * 1000);
    }

    function evaluateRound(lobbyId) {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        const round = lobby.rounds[lobby.currentRoundIndex];
        if (!round) return;
        console.log("evaluateRound")
        // Passage automatique au round suivant
        lobby.currentRoundIndex++;
        // RAZ du timer à chaque nouveau round
        setTimeout(() => launchNextRound(lobbyId), 4000);
    }

    function endGame(lobbyId) {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;

        io.to(lobbyId).emit('gameEnded', {
        scores: Object.fromEntries(lobby.scores)
        });

        lobby.status = 'waiting';
        lobby.rounds = [];
        lobby.scores = new Map();
        lobby.currentRoundIndex = 0;
        lobby.timeout = null;
    }
};
