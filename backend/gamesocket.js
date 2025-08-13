const { Server } = require('socket.io');

function getTracksFromRound(tracksInfo){

  if(!tracksInfo){
    console.error('tracksInfo invalide')
    return Promise.resolve([]);
  }
  const updateURL = tracksInfo.map((track) => {
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

module.exports = (io) => {

  const lobbies = new Map();

  io.on('connection', (socket) => {
    // Suppression d'une partie du lobby et de la base de données
    socket.on('deleteGame', async ({ lobbyCode, gameIndex }) => {
      const lobby = lobbies.get(lobbyCode);
      if (!lobby || !Array.isArray(lobby.games) || gameIndex < 0 || gameIndex >= lobby.games.length) return;
      // Suppression de la partie en mémoire
      const [removedGame] = lobby.games.splice(gameIndex, 1);
      lobbies.set(lobbyCode, lobby);
      io.to(lobbyCode).emit('updateGames', lobby.games);
      // Suppression en base de données si applicable (exemple)
      // Si tu as un modèle Game mongoose :
      // if (removedGame && removedGame._id) {
      //   try { await Game.deleteOne({ _id: removedGame._id }); } catch (e) { console.error(e); }
      // }
    });
    console.log('Utilisateur connecté:', socket.id);

    socket.on('joinLobby', (data) => {
      if (!data || !data.lobbyId || !data.username) {
        console.warn('joinLobby reçu avec des données invalides:', data);
        return; // On stoppe si données manquantes
      }
      
      const { lobbyId, username } = data;
      socket.username = username;
      socket.join(lobbyId);
      if (!lobbies.has(lobbyId)) {
        lobbies.set(lobbyId, {
          players: new Map(),
          status: 'waiting',
          currentGameIndex: 0, // index de la partie en cours
          currentTourIndex: 0, // index du tour en cours dans la partie
          roundDuration: 20,
          timeout: null,
          games: [], // tableau de parties, chaque partie a un tableau de tours
          scores: new Map(),
          roundHistory: [],
        });
        console.log(`Nouveau lobby créé: ${lobbyId}`);
      }


      const lobby = lobbies.get(lobbyId);

      if (lobby.games && lobby.games.length) {
        socket.emit('updateGames', lobby.games);
      }

      // Ajout l'utilisateur avec son username + socket.id
      lobby.players.set(username, {socketId: socket.id, score: 0 })

      // on utilise .keys() car on est dans une Map. Ici on récupère tous les pseudo des utilisateurs présents dans la Map
      io.to(lobbyId).emit('lobbyPlayers', [...lobby.players.keys()]);
      console.log(`Utilisateur ${socket.id} a rejoint le lobby ${lobbyId} sous le pseudo ${username}`);
    });

    socket.on("createGame", ({ lobbyCode, gameData }) => {
      if (!lobbyCode || !gameData || !Array.isArray(gameData.tours)) {
        console.warn('Données manquantes pour createGame', { lobbyCode, gameData });
        return;
      }
      const lobby = lobbies.get(lobbyCode);
      if (!lobby) {
        console.warn(`Lobby ${lobbyCode} non trouvé`);
        return;
      }
      // On ajoute la partie (game) complète avec ses tours
      const game = {
        theme: gameData.theme,
        tours: gameData.tours.map(tour => ({ ...tour, answers: new Map() }))
      };
      lobby.games.push(game);
      lobbies.set(lobbyCode, lobby);
      io.to(lobbyCode).emit("gameCreated", game);
      console.log(`Nouvelle partie créée dans lobby ${lobbyCode}`);
      io.to(lobbyCode).emit('updateGames', lobby.games);
    });

    socket.on('send_message', ({ lobbyId, message }) => {
      io.to(lobbyId).emit('receive_message', message);
    });

    socket.on('startGame', async (lobbyCode) => {
      console.log(`Démarrage de la partie pour le lobby ${lobbyCode}`);
      const lobby = lobbies.get(lobbyCode);
      if (!lobby || lobby.status === 'in-game' || !lobby.games.length) {
        socket.emit('errorMessage', 'Partie déjà en cours, lobby invalide ou aucune partie créée');
        return;
      }
      lobby.currentGameIndex = 0;
      lobby.currentTourIndex = 0;
      lobby.status = 'in-game';
      lobby.scores = new Map();

      io.to(lobbyCode).emit('gameStarted');

      console.log("Premier tour de la partie");
      setTimeout(() => launchNextTour(lobbyCode), 500);
    });

    socket.on('answer', ({ lobbyId, title, artist, guessTheKey, freeAnswer }) => {
      const lobby = lobbies.get(lobbyId);
      if (!lobby || lobby.status !== 'in-game') return;
      const game = lobby.games[lobby.currentGameIndex];
      if (!game) return;
      const round = game.tours[lobby.currentTourIndex];
      if (!round) return;

      if(round.guessTheKey) {

        const keyValue = round.key;
        // Gestion du format de réponse pour le round du point commun
        round.answers.set(socket.id, { freeAnswer: freeAnswer});

        const isCorrect = (freeAnswer).toLowerCase().trim() === keyValue.toLowerCase().trim();

        if(isCorrect){
          //Mise à jour du score
          const currentScore = lobby.scores.get(socket.id);
          lobby.scores.set(socket.id, currentScore +1)

          // Ajout de titre et artiste à l'historique pour la fin de Partie
          lobby.roundHistory.push({
            correctAnswer: {freeAnswer: keyValue},
            allAnswers: Object.fromEntries(round.answers),
          })

          socket.emit('roundEnded', {
            correctAnswer: { freeAnswer: keyValue},
            allAnswers: { [socket.id]: {freeAnswer}}
          });
        }
      } else { // Gestion classique des réponses pour la partie blindtest

        // Permet d'envoyer une réponse même si un seul champ est rempli
      round.answers.set(socket.id, { title, artist });

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

        const currentScore = lobby.scores.get(socket.id) || 0;
        lobby.scores.set(socket.id, currentScore +1)
        socket.emit('roundEnded', {
          correctAnswer :{ 
            ...(titleOk ? { title: round.title} : {}),
            ...(artistOk? { artist: round.artist} : {}),
          },
          allAnswers: { [socket.id]: { title: title || '', artist: artist || '' } }
        });
      }
    }});

    socket.on('requestCurrentGameState', (lobbyId) => {
      const lobby = lobbies.get(lobbyId);
      if (!lobby) return;

      if (lobby.status === 'in-game') {
        const game = lobby.games[lobby.currentGameIndex];
        if (!game) return;
        const round = game.tours[lobby.currentTourIndex];
        if (round) {
          socket.emit('newRound', {
            index: lobby.currentTourIndex + 1,
            total: game.tours.length,
            previewUrl: round.previewUrl,
            duration: lobby.roundDuration
          });
          console.log("Emission newRound");
        }
      }
    });

    socket.on('disconnect', () => {
      const username = socket.username;
      if (!username) {
        console.log(`Déconnexion socket ${socket.id} sans username`);
        return;
      }
      
      for (const [lobbyId, lobby] of lobbies.entries()) {
        if (lobby.players.size === 0) {
          lobby.emptySince = Date.now();
          console.log(`Lobby ${lobbyId} vide, suppression dans 5 min`);
          
          setTimeout(() => {
            const lobbyCheck = lobbies.get(lobbyId);
            if (lobbyCheck && lobbyCheck.players.size === 0) {
              lobbies.delete(lobbyId);
              console.log(`Lobby ${lobbyId} supprimé`);
            }
          }, 5 * 60 * 1000); // 5 min de délai avant suppression réelle du lobby
        }
      }
      console.log('Joueur déconnecté:', username, socket.id);
    });

  });

  function launchNextTour(lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return;
    const game = lobby.games[lobby.currentGameIndex];
    if (!game) return;

    console.log(`Lancement du tour ${lobby.currentTourIndex + 1} de la partie ${lobby.currentGameIndex + 1}`);

    if (lobby.currentTourIndex >= game.tours.length) {
      console.log("Fin de la partie");
      endGame(lobbyCode);
      return;
    }

    const round = game.tours[lobby.currentTourIndex];

    // Initialisation du trackIndex si absent
    if(round.guessTheKey) {
      // Round spécial pour le point commun
      io.to(lobbyCode).emit('newRound', {
        index: round.index,
        total: round.total,
        question: round.question,
        guessTheKey: true,
        duration: lobby.roundDuration,
      });
    } else {
      // Round classique de blindtest
      const tracks = [];
      
      if (round.manche && round.manche.trackId) {
        tracks.push({
          title: round.manche.titre,
          artist: round.manche.artiste,
          trackId: round.manche.trackId,
        });
      }
  
      getTracksFromRound(tracks).then(tracksWithPreview => {
        // On choisit le morceau correspondant au trackIndex
        const track = tracksWithPreview[round.trackIndex || 0];

        const allAnswers = {};
        for (let i = 1; i <= 5; i++) {
          if (round.manche && round.manche[`titre${i}`]) {
            allAnswers[`titre${i}`] = {
              title: round.manche[`titre${i}`],
              artist: round.manche[`artiste${i}`],
              trackId: round.manche[`trackId${i}`],
            };
          }
        }

        if (track) {
          io.to(lobbyCode).emit('newRound', {
            index: lobby.currentTourIndex + 1,
            total: game.tours.length,
            previewUrl: track.previewUrl,
            duration: lobby.roundDuration,
            title: track.title,
            artist: track.artist,
            allAnswers: allAnswers,
          });
        } else {
          io.to(lobbyCode).emit('newRound', {
            index: lobby.currentTourIndex + 1,
            total: game.tours.length,
            previewUrl: null,
            duration: lobby.roundDuration,
            title: null,
            artist: null,
            allAnswers: allAnswers,
            error: 'Aucun morceau valide pour ce round.'
          });
          console.error('Aucun morceau valide pour ce round, track est undefined.');
        }
      });
    }
  
    lobby.timeout = setTimeout(() => {
      evaluateTour(lobbyCode);
    }, lobby.roundDuration * 1000);
  }

  function evaluateTour(lobbyId) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    const game = lobby.games[lobby.currentGameIndex];
    if (!game) return;
    const round = game.tours[lobby.currentTourIndex];
    if (!round) return;
    console.log("evaluateTour");

    // Gestion des points à faire ici et MAJ des scores avant le round suivant
    lobby.roundHistory.push({
        roundIndex: lobby.currentRoundIndex,
        correctAnswer: round.guessTheKey
            ? { freeAnswer: "Key" }
            : {
                title: round.tracks
                    ? round.tracks[round.trackIndex]?.title
                    : round.title,
                artist: round.tracks
                    ? round.tracks[round.trackIndex]?.artist
                    : round.artist
            },
        allAnswers: Object.fromEntries(round.answers)
    });

    // Gestion spécifique du blindtest : plusieurs extraits dans un même round
    if (round.type === "blindtest") {
      if (round.trackIndex === undefined) round.trackIndex = 0;
      if (round.trackIndex < (round.tracks?.length || 1) - 1) {
        round.trackIndex++;
        setTimeout(() => launchNextTour(lobbyId), 4000);
        return;
      }
    }
    // Passage automatique au tour suivant
    lobby.currentTourIndex++;
    setTimeout(() => launchNextTour(lobbyId), 4000);
}

  function endGame(lobbyId) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    io.to(lobbyId).emit('gameEnded', {
      scores: lobby.scores,
      history: lobby.roundHistory,
    });

    // Reset du lobby pour la partie d'après
  lobby.status = 'waiting';
  lobby.games = [];
  lobby.scores = new Map();
  lobby.roundHistory = [];
  lobby.currentGameIndex = 0;
  lobby.currentTourIndex = 0;
  clearTimeout(lobby.timeout);
  lobby.timeout = null;
  }
};