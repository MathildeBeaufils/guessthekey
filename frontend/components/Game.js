import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import styles from "../styles/game.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import socket from '../socket';

function Game({lobbyCode}) {
  // TOUS les hooks doivent être appelés AVANT tout return conditionnel !
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

  // NE PAS faire de return avant les hooks !

  // Tous les hooks sont maintenant au bon endroit

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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    if (!lobbyCode) return;

    // Connection au lobby pour récupérer les infos en instantané
  socket.emit('joinLobby', {lobbyId: lobbyCode, username });
    console.log(` joined lobby ${lobbyCode}`);

  socket.emit("requestCurrentGameState", lobbyCode);

    socket.on("gameStarted", () => {
      console.log("La partie démarre !");
      setStatus("in-game");
    });

    socket.on("newRound", (tourData) => {
      if (status !== "in-game") {
        setStatus("in-game");
      }

      setTour({ 
        ...tourData,
        answers: new Map()
      });

      setTourResult(null);
      setFinalScores(null);
      setTimeLeft(tourData.duration);
      setAnswer({ title: "", artist: "", freeAnswer: "" });
    });

    socket.on("roundEnded", ({ correctAnswer, allAnswers }) => {
      setTourResult({ correctAnswer, allAnswers });
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

    if (tour.type !== "guessTheKey"){
      socket.emit("answer", {
        lobbyCode,
        title: answer.title,
        artist: answer.artist,
      });
    } else if (tour.type === "guessTheKey") {
      socket.emit('answer', {
        lobbyCode,
        freeAnswer: answer.freeAnswer})
    }

    
    setAnswer({ title: "", artist: "", freeAnswer: "" });
  };

  if (status === "waiting") {
    return <div>En attente du début de la partie...</div>;
  }

  if (status === "ended") {
    return (
      <div>
        <h2>Résultats finaux</h2>
        <ul>
          {Object.entries(finalScores || {}).map(([playerId, score]) => (
            <li key={playerId}>
              {playerId}: {score} point{score > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
        <h3>Réponses de la manche</h3>
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
            <input
              className={styles.input}
              placeholder="Titre"
              value={answer.title}
              onChange={(e) => setAnswer({ ...answer, title: e.target.value })}
              disabled={timeLeft === 0}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
            />
            <input
              className={styles.input}
              placeholder="Artiste"
              value={answer.artist}
              onChange={(e) => setAnswer({ ...answer, artist: e.target.value })}
              disabled={timeLeft === 0}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
            />
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

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="gameCode">Quel est le point commun ?</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Entrez le point commun"
              value={answer.freeAnswer}
              onChange={(e) => setAnswer({ ...answer, freeAnswer: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
            />
          </div>

          <button className={styles.btn} onClick={sendAnswer}>Valider</button>
        </>
      )}

      {tourResult && (
        <div>
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
