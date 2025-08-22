import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from "../styles/game.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import socket from '../socket';

function Game({lobbyCode}) {
  // Pour chaque round de blindtest, stocke [titre, artiste] ou ['Réponse non trouvée', 'Réponse non trouvée']
  const [userRecapAnswers, setUserRecapAnswers] = useState([
    ['Réponse non trouvée', 'Réponse non trouvée'],
    ['Réponse non trouvée', 'Réponse non trouvée'],
    ['Réponse non trouvée', 'Réponse non trouvée'],
    ['Réponse non trouvée', 'Réponse non trouvée'],
    ['Réponse non trouvée', 'Réponse non trouvée']
  ]);
  const [answerFeedback, setAnswerFeedback] = useState({ title: null, artist: null, guess: null }); 
  const [status, setStatus] = useState("waiting"); // waiting ou in-game ou ended
  const [tour, setTour] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answer, setAnswer] = useState({ title: "", artist: "", freeAnswer: "" });
  // Pour bloquer les inputs après bonne réponse
  const [locked, setLocked] = useState({ title: false, artist: false, freeAnswer: false });
  const [tourResult, setTourResult] = useState(null);
  const [finalScores, setFinalScores] = useState(null);
  const [tourHistory, setTourHistory] = useState([]);
  const [volume, setVolume] = useState(0.0);
  const [points, setPoints] = useState(0); // Ajout du score local
  const username = useSelector((state) => state.user.value.username);
  const audioRef = useRef();

  if (!lobbyCode) {
    return <div>Chargement du lobby...</div>;
  }

  // Affichage du score en haut à droite pendant la partie
  const ScoreAffichage = () => (
    <div style={{ position: 'absolute', top: 16, right: 24, background: '#fff', color: '#2d7a2d', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #0001', zIndex: 100 }}>
      Score : {points}
    </div>
  );

  // Fonction pour gérer le changement de volume via le curseur
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  useEffect(() => {
    if (!lobbyCode) return;

    // Connection au lobby pour récupérer les infos en instantané
    socket.emit('joinLobby', {lobbyId: lobbyCode, username });

    socket.emit("requestCurrentGameState", lobbyCode);

    // Écoute l'événement scoreUpdate pour mettre à jour le score en temps réel
    socket.on("scoreUpdate", ({ scores }) => {
      if (scores && scores[username] !== undefined) {
        setPoints(scores[username]);
      }
    });

    socket.on("gameStarted", () => {
      setStatus("in-game");
      setUserRecapAnswers([
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée']
      ]); // Réinitialise au début de partie
    });

    socket.on("newRound", (tourData) => {
      if (tourData.index === 1) setUserRecapAnswers([
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée'],
        ['Réponse non trouvée', 'Réponse non trouvée']
      ]);
      if (status !== "in-game") {
        setStatus("in-game");
      }
      setTour({ 
        ...tourData,
        type: tourData.guessTheKey ? "guessTheKey" : (tourData.type || "blindtest"),
        answers: new Map()
      });
      setTourResult(null); 
      setFinalScores(null);
      setTimeLeft(tourData.duration);
      setAnswer({ title: "", artist: "", freeAnswer: "" });
      setAnswerFeedback({ title: null, artist: null, guess: null });
      setLocked({ title: false, artist: false, freeAnswer: false }); // Débloque les inputs à chaque nouveau tour
    });

    socket.on("roundEnded", (payload) => {
      // On récupère l'index du round depuis le payload si possible
      const { correctAnswer, allAnswers, index, scores } = payload;
      const isGuessTheKey = tour?.type === "guessTheKey" || payload.type === "guessTheKey";
      // Met à jour le score local si le backend l'envoie
      if (scores && scores[username] !== undefined) {
        setPoints(scores[username]);
      }
      if (!isGuessTheKey) {
        const myAnswer = allAnswers && allAnswers[username];
        let titre = 'Réponse non trouvée';
        let artiste = 'Réponse non trouvée';
        if (myAnswer) {
          if (correctAnswer.title && myAnswer.title && myAnswer.title.toLowerCase().trim() === correctAnswer.title.toLowerCase().trim()) {
            titre = correctAnswer.title;
          }
          if (correctAnswer.artist && myAnswer.artist && myAnswer.artist.toLowerCase().trim() === correctAnswer.artist.toLowerCase().trim()) {
            artiste = correctAnswer.artist;
          }
        }
        const roundIdx = (typeof index === 'number' ? index : (tour?.index || 1)) - 1;
        setUserRecapAnswers(prev => {
          const next = prev.map((arr, idx) => idx === roundIdx ? [titre, artiste] : arr);
          return [...next];
        });

      } else {
        // Pour Guess The Key, stocker la réponse trouvée si correcte
        const myAnswer = allAnswers && allAnswers[username];
        let found = 'Réponse non trouvée';
        let expected = typeof correctAnswer === 'string' ? correctAnswer : (correctAnswer?.freeAnswer || '');
        if (myAnswer && expected && typeof myAnswer === 'string') {
          if (myAnswer.trim().toLowerCase() === expected.trim().toLowerCase()) {
            found = expected;
          }
        }
        setUserRecapAnswers(prev => {
          // Ajoute une 6e entrée pour Guess The Key
          const next = [...prev];
          if (next.length === 5) {
            next.push([found, '']);
          } else {
            next[5] = [found, ''];
          }
          return next;
        });
      }
      setTourResult({ correctAnswer, allAnswers });
      setAnswerFeedback({ title: null, artist: null, guess: null });
    });

    socket.on("gameEnded", ({ scores, history}) => {
      setFinalScores(scores);
      setTourHistory(history);
      setStatus("ended");
      setTour(null);
    });

    // Nettoyage au démontage ou si le lobbyId change
    return () => {
  socket.off("gameStarted");
  socket.off("newRound");
  socket.off("roundEnded");
  socket.off("gameEnded");
  socket.off("scoreUpdate");
    };
  }, [lobbyCode, status]);

  // Joue la musique à chaque nouveau round, y compris le premier
  useEffect(() => {
    const audio = audioRef.current;
    if (tour?.type !== "guessTheKey" && audio) {
      audio.pause();
      audio.src = tour.previewUrl;
      audio.volume = volume;

      const handleLoaded = () => {
        audio.play().catch((err) => {
          console.warn("Erreur lecture audio :", err);
        });
      };

      audio.addEventListener('loadeddata', handleLoaded);

      return () => {
        audio.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, [tour]);


  useEffect(() => {
    let timerId;
    if (timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timerId);
  }, [timeLeft]);



  const sendAnswer = () => {
    if (tour.type !== "guessTheKey" && (!answer.title && !answer.artist)) return;
    if (tour.type === "guessTheKey" && !answer.freeAnswer) return;

    if (tour.type !== "guessTheKey") {
      // Feedback immédiat séparé entre artiste et titre
      let titleFeedback = null;
      let artistFeedback = null;
      let newLocked = { ...locked };
      if (answer.title) {
        if (tour.title && answer.title.toLowerCase().trim() === tour.title.toLowerCase().trim()) {
          titleFeedback = { success: true, message: `Bonne réponse ! Titre : ${tour.title}` };
          newLocked.title = true;
        } else {
          titleFeedback = { success: false, message: "Titre incorrect" };
        }
      }
      if (answer.artist) {
        if (tour.artist && answer.artist.toLowerCase().trim() === tour.artist.toLowerCase().trim()) {
          artistFeedback = { success: true, message: `Bonne réponse ! Artiste : ${tour.artist}` };
          newLocked.artist = true;
        } else {
          artistFeedback = { success: false, message: "Artiste incorrect" };
        }
      }
      setAnswerFeedback({ title: titleFeedback, artist: artistFeedback });
      setLocked(newLocked);
      socket.emit("answer", {
        lobbyId: lobbyCode,
        title: answer.title,
        artist: answer.artist,
      });
    } else if (tour.type === "guessTheKey") {
      // Feedback immédiat pour Guess The Key
      let guessFeedback = null;
      let newLocked = { ...locked };
      if (answer.freeAnswer && (tour.key || tour.question)) {
        const expected = (tour.key || tour.question || '').toLowerCase().trim();
        const user = answer.freeAnswer.toLowerCase().trim();
        if (expected && user === expected) {
          guessFeedback = { success: true, message: "Bonne réponse !" };
          newLocked.freeAnswer = true;
        } else {
          guessFeedback = { success: false, message: "Mauvaise réponse" };
        }
      }
      setAnswerFeedback({ title: null, artist: null, guess: guessFeedback });
      setLocked(newLocked);
      socket.emit('answer', {
        lobbyId: lobbyCode,
        freeAnswer: answer.freeAnswer
      });
    }
  setAnswer({ title: "", artist: "", freeAnswer: "" });
  };

  if (status === "waiting") {
    return <div>En attente du début de la partie...</div>;
  }

  const router = useRouter();
  if (status === "ended") {
    // Gestion du bouton prochaine partie 
    const handleNextGame = () => {
      socket.emit('startNextGame', { lobbyCode });
    };
    const handleReturnLobby = () => {
      router.push(`/lobby/${lobbyCode}`);
    };

    // Affiche les titres et artistes attendus pour chaque manche, même s'ils n'ont pas été trouvés
    const titresArtistes = Array.from({length: 5}).map((_, idx) => {
      const round = tourHistory[idx] || {};
      const title = round.correctAnswer && typeof round.correctAnswer.title !== 'undefined' ? round.correctAnswer.title : '-';
      const artist = round.correctAnswer && typeof round.correctAnswer.artist !== 'undefined' ? round.correctAnswer.artist : '-';
      return `${title} - ${artist}`;
    });
    // Affiche la key attendue même si elle n'a pas été trouvée
    let keyValue = '-';
    for (let i = tourHistory.length - 1; i >= 0; i--) {
      if (typeof tourHistory[i]?.correctAnswer?.freeAnswer !== 'undefined') {
        keyValue = tourHistory[i].correctAnswer.freeAnswer || '-';
        break;
      }
    }

    // Classement des joueurs dans la partie en cours
    const classement = Object.entries(finalScores || {})
      .sort((a, b) => b[1] - a[1])
      .map(([playerId, score], idx) => ({ playerId, score, rank: idx + 1 }));

    // Score du joueur courant
    const myScore = classement.find(e => e.playerId === username)?.score ?? points;

    return (
      <div>
        <h2>Résultats finaux</h2>
        <div style={{ fontWeight: 'bold', fontSize: 20, color: '#2d7a2d', marginBottom: 12 }}>
          Votre score : {myScore} point{myScore > 1 ? 's' : ''}
        </div>
        <h3>Classement du lobby</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 400, marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>#</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Joueur</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {classement.map(({ playerId, score, rank }) => (
              <tr key={playerId} style={{ background: playerId === username ? '#eaffea' : 'transparent' }}>
                <td>{rank}</td>
                <td>{playerId}</td>
                <td>{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Résumé de la partie :</h3>
        <div style={{ fontSize: 16, margin: '16px 0' }}>
          {titresArtistes.map((txt, i) => <div key={i}>{txt}</div>)}
          <div style={{ marginTop: 8 }}><b>Key :</b> {keyValue}</div>
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <button className={styles.button} onClick={handleNextGame}>Prochaine partie</button>
          <button className={styles.button} onClick={handleReturnLobby}>Retour lobby</button>
        </div>
      </div>
    );
  }

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <FaVolumeMute className={styles.icon} />;
    } else if (volume < 0.5) {
      return <FaVolumeDown className={styles.icon} />;
    } else {
      return <FaVolumeUp className={styles.icon} />;
    }
  };

  return (
  <div className={styles.container}>
    {status === "in-game" && <ScoreAffichage />}
  {tour?.type !== "guessTheKey" && (
        <>
          <img className={styles.vynil} src="/source.gif" />
          <h2>
            Manche {tour?.index} / {tour?.total}
          </h2>

          <audio ref={audioRef} />

          <div className={styles.volume_container}>
            {getVolumeIcon()}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volume_slider}
            />
          </div>
          <p>Temps restant: {timeLeft}s</p>

          <div className={styles.input_container}>
            <input
              className={styles.input}
              placeholder="Titre"
              value={answer.title}
              onChange={(e) => setAnswer({ ...answer, title: e.target.value })}
              disabled={timeLeft === 0 || locked.title}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
            />
            {answerFeedback && answerFeedback.title && (
              <div style={{ color: answerFeedback.title.success ? '#2d7a2d' : 'red', fontWeight: 'bold', marginBottom: 4 }}>
                {answerFeedback.title.message}
              </div>
            )}
              <input
                className={styles.input}
                placeholder="Artiste"
                value={answer.artist}
                onChange={(e) => setAnswer({ ...answer, artist: e.target.value })}
                disabled={timeLeft === 0 || locked.artist}
                onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
              />
            {answerFeedback && answerFeedback.artist && (
              <div style={{ color: answerFeedback.artist.success ? '#2d7a2d' : 'red', fontWeight: 'bold', marginBottom: 4 }}>
                {answerFeedback.artist.message}
              </div>
            )}
            <div className={styles.button_send}>
              <button
                className={styles.button}
                onClick={sendAnswer}
                disabled={timeLeft === 0}
              >
                Envoyer
              </button>
            </div>
          </div>
        </>
      )}

{tour?.type === "guessTheKey" && (
  <>
    <h1>Guess The Key</h1>
    <p>Temps restant: {timeLeft}s</p>
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor="gameCode">Quel est le point commun entre les morceaux ?</label>
      <input
        className={styles.input}
        type="text"
        placeholder="Entrez le point commun"
        value={answer.freeAnswer}
        onChange={(e) => setAnswer({ ...answer, freeAnswer: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
        disabled={locked.freeAnswer}
      />
      {answerFeedback && answerFeedback.guess && (
        <div style={{ color: answerFeedback.guess.success ? '#2d7a2d' : 'red', fontWeight: 'bold', marginTop: 8 }}>
          {answerFeedback.guess.message}
        </div>
      )}
      <button className={styles.btn} onClick={sendAnswer} style={{marginTop: 8}}>Valider</button>


      <div style={{ marginTop: 24, color: '#2d7a2d', fontSize: 14 }}>
        <b>Tableau de vos bonnes réponses :</b>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 8 }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Tour</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Titre trouvé</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Artiste trouvé</th>
            </tr>
          </thead>
          <tbody>
            {userRecapAnswers.map(([titre, artiste], i) => {
              if (i < 5) {
                return (
                  <tr key={i}>
                    <td style={{ borderBottom: '1px solid #eee' }}>Tour {i+1}</td>
                    <td style={{ borderBottom: '1px solid #eee' }}>{titre !== 'Réponse non trouvée' ? titre : ''}</td>
                    <td style={{ borderBottom: '1px solid #eee' }}>{artiste !== 'Réponse non trouvée' ? artiste : ''}</td>
                  </tr>
                );
              }
              // Affiche Guess The Key comme 6e ligne, même si non trouvée
              if (i === 5) {
                return (
                  <tr key={i}>
                    <td style={{ borderBottom: '1px solid #eee' }}>Guess The Key</td>
                    <td style={{ borderBottom: '1px solid #eee' }} colSpan={2}>{titre !== 'Réponse non trouvée' ? titre : ''}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}

{tourResult && (
  <div style={{ marginTop: '20px' }}>
    <h3>Réponses de la manche :</h3>
    {tour?.type !== "guessTheKey" && (
      <>
        <p>
          Réponse correcte: {tourResult.correctAnswer && typeof tourResult.correctAnswer === 'object'
            ? `${tourResult.correctAnswer.title || ''} - ${tourResult.correctAnswer.artist || ''}`
            : String(tourResult.correctAnswer)}
        </p>
        <ul>
          {Object.entries(tourResult.allAnswers).map(([playerId, ans]) => (
            <li key={playerId}>
              {playerId}: {ans && typeof ans === 'object'
                ? `${ans.title || ''} - ${ans.artist || ''}`
                : String(ans)}
            </li>
          ))}
        </ul>
      </>
    )}
    {tour?.type === "guessTheKey" && (
      <>
        <p>Réponse correcte: {tourResult.correctAnswer && typeof tourResult.correctAnswer === 'object'
          ? tourResult.correctAnswer.freeAnswer || JSON.stringify(tourResult.correctAnswer)
          : String(tourResult.correctAnswer)}</p>
        <ul>
          {Object.entries(tourResult.allAnswers).map(([playerId, ans]) => (
            <li key={playerId}>
              {playerId}: {typeof ans === 'string' ? ans : JSON.stringify(ans)}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)}
        
      </div>
    );
  }
  export default Game;
