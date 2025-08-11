import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { useRouter} from 'next/router';
import styles from "../styles/lobby.module.css";
console.log('Tentative de connexion socket...');
const socket = io('http://localhost:4000'); // port déterminé dans le backend, spécifique pour le Socket

const Lobby = () => {
    const router = useRouter();
    const { code } = router.query;

const [lobbyId, setLobbyId] = useState("NomduLobby");
const [players, setPlayers] = useState([]);
const [gameStarted, setGameStarted] = useState(false);
const username = useSelector(state => state.user.username);


useEffect(() => {
    setLobbyId(code);
    //Connexion à un lobby existant via son ID
    socket.emit('joinLobby', {lobbyId, username});
}, [code])

useEffect(() => {
    
    // Mise à jour des joueureuses présent.es dans le lobby
    socket.on('lobbyPlayers', (playersList) => {
        setPlayers(playersList);
    });
    // Lancement de la partie au click du bouton
    socket.on('gameStarted', () => {
        setGameStarted(true);
    });

    // Fonction de nettoyage : lors du démontage du composant, la socket arrête l'écoute de lobbyPlaers et gameStarted => Evite les doublons
    return() => {
        socket.off('lobbyPlayers');
        socket.off('gameStarted');
    };
}, [lobbyId, username]);

const startGame = () => {
    console.log(`Lancement de la partie pour le lobby ${lobbyId}`)
    socket.emit('startGame', lobbyId);
};

useEffect(() => {
    if(gameStarted){
        router.push(`/gamepage?lobbyId=${lobbyId}`);
    } 
}, [gameStarted, router]);

// Infos du lobby
  return (
    <div className={styles.container}>
      <span className={styles.welcome}>Bienvenue dans le {lobbyId}</span>
      <button className={styles.button}>Ajouter un membre</button>
      <div className={styles.players_container}>
        <ul>
        {players.map((playerId) => (
        <li key={playerId}>{playerId.username}</li>
      ))}
      </ul>
      </div>
      <button className={styles.button} onClick={startGame}>Lancer la partie</button>
    </div>
  );
};

export default Lobby;