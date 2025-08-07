import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useRouter} from 'next/router';

console.log('Tentative de connexion socket...');
const socket = io('http://localhost:4000'); // port déterminé dans le backend, spécifique pour le Socket

const Lobby = () => {
    const [lobbyId, setLobbyId] = useState('NomduLobby');
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    const router = useRouter();

    // Récupération d'un nom de lobby
    useEffect(() => {
    // Appel API pour obtenir un lobbyId unique
    fetch('http://localhost:3000/lobbies', {
        method: 'POST',
    })
        .then(res => res.json())
        .then(data => {
        setLobbyId(data.lobbyId);
        });
    }, []);

    useEffect(() => {
        //Connexion à un lobby existant via son ID
        socket.emit('joinLobby', lobbyId);

        // Mise à jour des joueureuses présent.es dans le lobby
        socket.on('lobbyPlayers', (playerList) => {
            setPlayers(playerList);
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
    }, [lobbyId]);

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
        <div>
            <span>Bienvenue dans le lobby {lobbyId}</span>
            <p>Joueureuses connecté.es :</p>
            {players.map((playerId) => (
                <span key={playerId}>{playerId}</span>
            ))}

            <button onClick={startGame} >
                Lancer la partie
            </button>
        </div>
    )
};

export default Lobby;