import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from "../styles/game.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import socket from '../socket';

function Game({lobbyCode}) {
  // Pour chaque round de blindtest, stocke [titre, artiste] ou ['Réponse non trouvée', 'Réponse non trouvée']
  const [userRecapAnswers, setUserRecapAnswers] = useState([['Réponse non trouvée', 'Réponse non trouvée'], ['Réponse non trouvée', 'Réponse non trouvée'], ['Réponse non trouvée', 'Réponse non trouvée'], ['Réponse non trouvée', 'Réponse non trouvée'], ['Réponse non trouvée', 'Réponse non trouvée']]);
  const [answerFeedback, setAnswerFeedback] = useState({ title: null, artist: null, guess: null }); 
  
  const [status, setStatus] = useState("waiting"); // waiting ou in-game ou ended
  const [tour, setTour] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answer, setAnswer] = useState({ title: "", artist: "", freeAnswer: "" });
  const [tourResult, setTourResult] = useState(null);
  const [finalScores, setFinalScores] = useState(null);
  const [tourHistory, setTourHistory] = useState([]);
  const [volume, setVolume] = useState(0.0);
  const username = useSelector((state) => state.user.value.username);
  const audioRef = useRef();

  if (!lobbyCode) {
    return <div>Chargement du lobby...</div>;
  }

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
    console.log(` joined lobby ${lobbyCode}`);

    socket.emit("requestCurrentGameState", lobbyCode);

    socket.on("gameStarted", () => {
      console.log("La partie démarre !");
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
    });

    socket.on("roundEnded", (payload) => {
      // On récupère l'index du round depuis le payload si possible
      const { correctAnswer, allAnswers, index } = payload;
      const isGuessTheKey = tour?.type === "guessTheKey" || payload.type === "guessTheKey";
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
        if (myAnswer && correctAnswer && typeof correctAnswer === 'string' && typeof myAnswer === 'string') {
          if (myAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
            found = correctAnswer;
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
    };
  }, [lobbyCode, status]);

  // Joue la musique à chaque nouveau round, y compris le premier
  useEffect(() => {
    if (tour?.type !== "guessTheKey" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tour.previewUrl;
      audioRef.current.volume = volume; // Utiliser la valeur du state pour le volume
      audioRef.current.play();
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
      if (answer.title) {
        if (tour.title && answer.title.toLowerCase().trim() === tour.title.toLowerCase().trim()) {
          titleFeedback = { success: true, message: "Titre trouvé !" };
        } else {
          titleFeedback = { success: false, message: "Titre incorrect" };
        }
      }
      if (answer.artist) {
        if (tour.artist && answer.artist.toLowerCase().trim() === tour.artist.toLowerCase().trim()) {
          artistFeedback = { success: true, message: "Artiste trouvé !" };
        } else {
          artistFeedback = { success: false, message: "Artiste incorrect" };
        }
      }
      setAnswerFeedback({ title: titleFeedback, artist: artistFeedback });
      socket.emit("answer", {
        lobbyCode,
        title: answer.title,
        artist: answer.artist,
      });
    } else if (tour.type === "guessTheKey") {
      // Feedback immédiat pour Guess The Key
      let guessFeedback = null;
      if (answer.freeAnswer && (tour.key || tour.question)) {
        const expected = (tour.key || tour.question || '').toLowerCase().trim();
        const user = answer.freeAnswer.toLowerCase().trim();
        if (expected && user === expected) {
          guessFeedback = { success: true, message: "Bonne réponse !" };
        } else {
          guessFeedback = { success: false, message: "Mauvaise réponse" };
        }
      }
      setAnswerFeedback({ title: null, artist: null, guess: guessFeedback });
      socket.emit('answer', {
        lobbyCode,
        freeAnswer: answer.freeAnswer
      });
    }
    setAnswer({ title: "", artist: "", freeAnswer: "" });
  };

  if (status === "waiting") {
    return <div className={styles.container}>En attente du début de la partie...</div>;
  }

  const router = useRouter();
  if (status === "ended") {
    // Gestion du bouton prochaine partie : on suppose que le backend gère la file de parties
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
    // Affiche la key attendue même si elle est vide ou non trouvée
    let keyValue = '-';
    for (let i = tourHistory.length - 1; i >= 0; i--) {
      if (typeof tourHistory[i]?.correctAnswer?.freeAnswer !== 'undefined') {
        keyValue = tourHistory[i].correctAnswer.freeAnswer || '-';
        break;
      }
    }
    return (
      <div className={styles.container}>
        <h2>Résultats finaux</h2>
        <ul>
          {Object.entries(finalScores || {}).map(([playerId, score]) => (
            <li key={playerId}>
              {playerId}: {score} point{score > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'black', marginTop: '20px' }}>
          <h3>Résumé de la partie :</h3>
          <div style={{ fontSize: '16px', margin: '16px 0' }}>
            {titresArtistes.map((txt, i) => <div key={i}>{txt}</div>)}
            <div style={{ marginTop: '8px' }}><b>Key :</b> {keyValue}</div>
          </div>
        </div>
        <div className={styles.button_container}>
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
            {/* Résumé des réponses de la partie (blindtest) */}
            {userRecapAnswers.some(([titre, artiste]) => titre !== 'Réponse non trouvée' || artiste !== 'Réponse non trouvée') && (
              <div style={{ marginBottom: '10px', color: '#B2F4A5', fontSize: '14px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                <b>Réponses trouvées :</b>
                <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'none' }}>
                  {userRecapAnswers.map(([titre, artiste], i) => {
                    if (titre !== 'Réponse non trouvée' || artiste !== 'Réponse non trouvée') {
                      return <li key={i}>{titre !== 'Réponse non trouvée' ? titre : ''}{(titre !== 'Réponse non trouvée' && artiste !== 'Réponse non trouvée') ? ' - ' : ''}{artiste !== 'Réponse non trouvée' ? artiste : ''}</li>;
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}
            
            {answerFeedback && (
              <div style={{ color: answerFeedback.success ? '#B2F4A5' : 'red', fontWeight: 'bold', marginBottom: '8px' }}>
                {answerFeedback.message}
              </div>
            )}
            <input
            className={styles.input}
            placeholder="Titre"
            value={answer.title}
            onChange={(e) => setAnswer({ ...answer, title: e.target.value })}
            disabled={timeLeft === 0}
            onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
          />
          {answerFeedback && answerFeedback.title && (
            <div style={{ color: answerFeedback.title.success ? '#B2F4A5' : 'red', fontWeight: 'bold', marginBottom: '4px' }}>
              {answerFeedback.title.message}
            </div>
          )}
          <input
            className={styles.input}
            placeholder="Artiste"
            value={answer.artist}
            onChange={(e) => setAnswer({ ...answer, artist: e.target.value })}
            disabled={timeLeft === 0}
            onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
          />
          {answerFeedback && answerFeedback.artist && (
            <div style={{ color: answerFeedback.artist.success ? '#B2F4A5' : 'red', fontWeight: 'bold', marginBottom: '4px' }}>
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
      />
      {answerFeedback && answerFeedback.guess && (
        <div style={{ color: answerFeedback.guess.success ? '#B2F4A5' : 'red', fontWeight: 'bold', marginTop: '8px' }}>
          {answerFeedback.guess.message}
        </div>
      )}
      <button className={styles.btn} onClick={sendAnswer} style={{marginTop: '8px'}}>Valider</button>

      {/* Tableau des bonnes réponses trouvées par l'utilisateur, y compris Guess The Key */}
      {userRecapAnswers.some(([titre, artiste], idx) => (idx < 5 && (titre !== 'Réponse non trouvée' || artiste !== 'Réponse non trouvée')) || (idx === 5 && titre !== 'Réponse non trouvée')) && (
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
                if (i < 5 && (titre !== 'Réponse non trouvée' || artiste !== 'Réponse non trouvée')) {
                  return (
                    <tr key={i}>
                      <td style={{ borderBottom: '1px solid #eee' }}>Tour {i+1}</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{titre !== 'Réponse non trouvée' ? titre : ''}</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{artiste !== 'Réponse non trouvée' ? artiste : ''}</td>
                    </tr>
                  );
                }
                // Affiche Guess The Key comme 6e ligne si trouvée
                if (i === 5 && titre !== 'Réponse non trouvée') {
                  return (
                    <tr key={i}>
                      <td style={{ borderBottom: '1px solid #eee' }}>Guess The Key</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{titre}</td>
                      <td style={{ borderBottom: '1px solid #eee' }}></td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>
)}

      {tourResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Réponses de la manche :</h3>

          {tour?.type !== "guessTheKey" && (
            <>
              <p>
                Réponse correcte: {tourResult.correctAnswer.title} - {tourResult.correctAnswer.artist}
              </p>
              <ul>
                {Object.entries(tourResult.allAnswers).map(([playerId, ans]) => (
                  <li key={playerId}>
                    {playerId}: {ans.title} - {ans.artist}
                  </li>
                ))}
              </ul>
            </>
          )}

          {tour?.type === "guessTheKey" && (
            <>
              <p>Réponse correcte: {tourResult.correctAnswer}</p>
              <ul>
                {Object.entries(tourResult.allAnswers).map(([playerId, ans]) => (
                  <li key={playerId}>
                    {playerId}: {ans}
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