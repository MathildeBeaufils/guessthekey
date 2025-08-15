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
          roundDuration: 16, // remettre à 20 après les tests
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
      // Initialise les scores à 0 pour tous les joueurs
      for (const username of lobby.players.keys()) {
        lobby.scores.set(username, 0);
      }

      io.to(lobbyCode).emit('gameStarted');

      console.log("Premier tour de la partie");
      setTimeout(() => launchNextTour(lobbyCode), 500);
    });

    socket.on('startNextGame', ({ lobbyCode }) => {
      const lobby = lobbies.get(lobbyCode);
      if (!lobby) return;
      // Vérifie s'il y a une partie suivante
      if (lobby.currentGameIndex + 1 >= lobby.games.length) {
        socket.emit('errorMessage', 'Aucune partie suivante disponible');
        return;
      }
      lobby.currentGameIndex++;
      lobby.currentTourIndex = 0;
      lobby.status = 'in-game';
      lobby.scores = new Map();
      // Initialise les scores à 0 pour tous les joueurs
      for (const username of lobby.players.keys()) {
        lobby.scores.set(username, 0);
      }
      io.to(lobbyCode).emit('gameStarted');
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
        // Stocke la réponse comme une string pour ce mode
        round.answers.set(socket.username, typeof freeAnswer === 'string' ? freeAnswer : '');

        const isCorrect = (freeAnswer || '').toLowerCase().trim() === (keyValue || '').toLowerCase().trim();
        if(isCorrect){
          // Mise à jour du score
          const currentScore = lobby.scores.get(socket.username) || 0;
          lobby.scores.set(socket.username, currentScore + 50);
        }
        // Prépare le mapping scores username -> score
        const scoresObj = {};
        for (const [username, score] of lobby.scores.entries()) {
          scoresObj[username] = score;
        }
        // Envoie scoreUpdate à tous les joueurs du lobby (mise à jour temps réel)
        io.to(lobbyId).emit('scoreUpdate', { scores: scoresObj });

        // Ajout de la clé à l'historique pour la fin de Partie
        lobby.roundHistory.push({
          correctAnswer: {freeAnswer: keyValue},
          allAnswers: Object.fromEntries(round.answers),
        });
        // Envoie roundEnded à tous les joueurs du lobby
        for (const [username, player] of lobby.players.entries()) {
          const socketId = player.socketId;
          io.to(socketId).emit('roundEnded', {
            correctAnswer: keyValue,
            allAnswers: Object.fromEntries(round.answers),
            scores: scoresObj
          });
        }
      } else { // Gestion classique des réponses pour la partie blindtest
        // Permet d'envoyer une réponse même si un seul champ est rempli
        round.answers.set(socket.username, { title, artist });

        // Récupère l'index du round courant (pour multi-extraits)
        const idx = lobby.currentTourIndex;
        // Prend la bonne réponse depuis round.manche
        let roundTitle = '';
        let roundArtist = '';
        if (round.manche) {
          roundTitle = round.manche[`titre${idx+1}`] || round.manche.titre || '';
          roundArtist = round.manche[`artiste${idx+1}`] || round.manche.artiste || '';
        }
        const correctTitle = roundTitle ? roundTitle.toLowerCase() : '';
        const correctArtist = roundArtist ? roundArtist.toLowerCase() : '';
        const titleAnswer = (title || '').toLowerCase();
        const artistAnswer = (artist || '').toLowerCase();

        const titleOk = titleAnswer === correctTitle && correctTitle !== '';
        const artistOk = artistAnswer === correctArtist && correctArtist !== '';

        let correctAnswer = {};
        let pointsToAdd = 0;
        if (titleOk) {
          correctAnswer.title = roundTitle;
          pointsToAdd += 10;
          const currentScore = lobby.scores.get(socket.username) || 0;
          lobby.scores.set(socket.username, currentScore + 10);
          
          // Mise à jour temps réel après titre trouvé
          const scoresObj = {};
          for (const [username, score] of lobby.scores.entries()) {
            scoresObj[username] = score;
          }
          io.to(lobbyId).emit('scoreUpdate', { scores: scoresObj });
        }
        if (artistOk) {
          console.log('[SCORE] Comparaison artiste:', artistAnswer, correctArtist, '->', artistOk);
          correctAnswer.artist = roundArtist;
          pointsToAdd += 10;
          const currentScore = lobby.scores.get(socket.username) || 0;
          lobby.scores.set(socket.username, currentScore + 10);
          console.log('[SCORE] Nouveau score pour', socket.username, ':', lobby.scores.get(socket.username));
          // Mise à jour temps réel après artiste trouvé
          const scoresObj = {};
          for (const [username, score] of lobby.scores.entries()) {
            scoresObj[username] = score;
          }
          io.to(lobbyId).emit('scoreUpdate', { scores: scoresObj });
        }
        // scores de fin de tour
        const scoresObj = {};
        for (const [username, score] of lobby.scores.entries()) {
          scoresObj[username] = score;
        }
        // Envoie roundEnded à tous les joueurs du lobby à la fin du round
        for (const [username, player] of lobby.players.entries()) {
          const socketId = player.socketId;
          io.to(socketId).emit('roundEnded', {
            correctAnswer :{ 
              ...(titleOk ? { title: roundTitle} : {}),
              ...(artistOk? { artist: roundArtist} : {}),
            },
            allAnswers: Object.fromEntries(round.answers),
            scores: scoresObj
          });
        }
      }
    });

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

    // Si c'est un Guess The Key (point commun)
    if (round.guessTheKey || round.type === 'guessTheKey') {
      io.to(lobbyCode).emit('newRound', {
        index: lobby.currentTourIndex + 1,
        total: game.tours.length,
        question: round.question,
        guessTheKey: true,
        key: round.key,
        duration: lobby.roundDuration,
      });
      lobby.timeout = setTimeout(() => {
        evaluateTour(lobbyCode);
      }, lobby.roundDuration * 1000);
      return;
    }

    // Sinon, round classique de blindtest
    // Si pas de morceau valide, on saute ce round
    if (!(round.manche && round.manche.trackId)) {
      console.warn('Round sans morceau valide, on passe au suivant.');
      lobby.currentTourIndex++;
      setTimeout(() => launchNextTour(lobbyCode), 100);
      return;
    }

    const tracks = [{
      title: round.manche.titre,
      artist: round.manche.artiste,
      trackId: round.manche.trackId,
    }];

    getTracksFromRound(tracks).then(tracksWithPreview => {
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
        console.error('Aucun morceau valide pour ce round, track est undefined. On saute au suivant.');
        lobby.currentTourIndex++;
        setTimeout(() => launchNextTour(lobbyCode), 100);
        return;
      }

      lobby.timeout = setTimeout(() => {
        evaluateTour(lobbyCode);
      }, lobby.roundDuration * 1000);
    });
  }

  function evaluateTour(lobbyId) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    const game = lobby.games[lobby.currentGameIndex];
    if (!game) return;
    const round = game.tours[lobby.currentTourIndex];
    if (!round) return;
    console.log("evaluateTour");

    
    if (round.guessTheKey) {
      lobby.roundHistory.push({
        roundIndex: lobby.currentRoundIndex,
        correctAnswer: { freeAnswer: round.key || '-' },
        allAnswers: Object.fromEntries(round.answers)
      });
    } else if (round.manche) {
      // On récupère le bon titre/artiste pour ce tour (blindtest)
      // Chaque round correspond à une position (1 à 5)
      const idx = lobby.currentTourIndex;
      const titre = round.manche[`titre${idx+1}`] || round.manche.titre || '-';
      const artiste = round.manche[`artiste${idx+1}`] || round.manche.artiste || '-';
      const key = round.manche.key || '-';
      lobby.roundHistory.push({
        roundIndex: lobby.currentRoundIndex,
        correctAnswer: { title: titre, artist: artiste, freeAnswer: key },
        allAnswers: Object.fromEntries(round.answers)
      });
    } else {
      
      lobby.roundHistory.push({
        roundIndex: lobby.currentRoundIndex,
        correctAnswer: { title: round.title || '-', artist: round.artist || '-', freeAnswer: round.key || '-' },
        allAnswers: Object.fromEntries(round.answers)
      });
    }

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

    // Transforme la Map en objet simple pour le frontend
    const scoresObj = {};
    for (const [username, score] of lobby.scores.entries()) {
      scoresObj[username] = score;
    }
    io.to(lobbyId).emit('gameEnded', {
      scores: scoresObj,
      history: lobby.roundHistory,
    });

    // Supprime uniquement la partie terminée du tableau des parties
    if (Array.isArray(lobby.games) && lobby.games.length > 0) {
      lobby.games.splice(lobby.currentGameIndex, 1);
    }
    lobby.status = 'waiting';
    lobby.scores = new Map();
    lobby.roundHistory = [];
    lobby.currentGameIndex = 0;
    lobby.currentTourIndex = 0;
    clearTimeout(lobby.timeout);
    lobby.timeout = null;
    // Met à jour la liste des parties côté clients
    io.to(lobbyId).emit('updateGames', lobby.games);
  }
};