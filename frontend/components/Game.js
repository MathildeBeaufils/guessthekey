import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";
import styles from "../styles/game.module.css";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";

const socket = io("http://localhost:4000"); // port déterminé dans le backend, spécifique pour le Socket

function Game() {
  // Le useRouter a besoin d'un cycle pour récupérer les infos
  const router = useRouter();
  const { lobbyId } = router.query;
  const isReady = router.isReady;

  const [status, setStatus] = useState("waiting"); // waiting ou in-game ou ended
  const [round, setRound] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answer, setAnswer] = useState({ title: "", artist: "" });
  const [roundResult, setRoundResult] = useState(null);
  const [finalScores, setFinalScores] = useState(null);
  // Nouvel état pour gérer le volume, de 0 (muet) à 1 (max)
  const [volume, setVolume] = useState(0.0);

  const audioRef = useRef();

  if (!router.isReady || !lobbyId) {
    return <div>Chargement du lobby...</div>;
  }

  useEffect(() => {
    if (!lobbyId || !isReady) return;

    // Connection au lobby pour récupérer les infos en instantané
    socket.emit("joinLobby", lobbyId);
    console.log(` joined lobby ${lobbyId}`);
    socket.emit("requestCurrentGameState", lobbyId);

    socket.on("newRound", ({ index, total, previewUrl, duration }) => {
      console.log("New round");
      setStatus("in-game");
      setRound({ index, total, previewUrl, duration });
      setRoundResult(null);
      setFinalScores(null);
      setTimeLeft(duration);
      setAnswer({ title: "", artist: "" });
    });

    socket.on("roundEnded", ({ correctAnswer, allAnswers }) => {
      setRoundResult({ correctAnswer, allAnswers });
    });

    socket.on("gameEnded", ({ scores }) => {
      setFinalScores(scores);
      setStatus("ended");
      setRound(null);
    });

    // Nettoyage au démontage ou si le lobbyId change
    return () => {
      socket.off("newRound");
      socket.off("roundEnded");
      socket.off("gameEnded");
    };
  }, [lobbyId, isReady]);

  if (!isReady) {
    return <div>Chargement du lobby...</div>;
  }

  // Joue la musique à chaque nouveau round, y compris le premier
  useEffect(() => {
    if (round && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = round.previewUrl;
      audioRef.current.volume = volume; // Utiliser la valeur du state pour le volume
      audioRef.current.play();
    }
  }, [round]);

  useEffect(() => {
    let timerId;
    if (timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Fonction pour gérer le changement de volume via le curseur
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const sendAnswer = () => {
    if (!answer.title && !answer.artist) return;
    socket.emit("answer", {
      lobbyId,
      title: answer.title,
      artist: answer.artist,
    });
    setAnswer({ title: "", artist: "" });
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
      <img className={styles.vynil} src="/source.gif" />
      <h2>
        Manche {round?.index} / {round?.total}
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

      {roundResult && (
        <div>
          <h3>Réponses de la manche :</h3>
          <p>
            Réponse correcte: {roundResult.correctAnswer.title} -{" "}
            {roundResult.correctAnswer.artist}
          </p>
          <ul>
            {Object.entries(roundResult.allAnswers).map(([playerId, ans]) => (
              <li key={playerId}>
                {playerId}: {ans.title} - {ans.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Game;
