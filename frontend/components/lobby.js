import React, { useEffect, useState, useRef } from 'react';
import Menu from "./Menu";
import { useSelector } from 'react-redux';
import { useRouter} from 'next/router';
import styles from "../styles/lobby.module.css";
import socket from '../socket';


const Lobby = ({lobbyCode}) => {
    const router = useRouter();
    const { code } = router.query;
    const username = useSelector((state) => state.user.value.username);

    // lobbyCode est passé en props et utilisé partout
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [games, setGames] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    // const [selectedRound, setSelectedRound] = useState({});





    useEffect(() => {
        socket.on('errorMessage', (msg) => {
            setErrorMsg(msg);
        });
    if (!lobbyCode) return;
    socket.emit('joinLobby', {lobbyId: lobbyCode, username});
        
        // Mise à jour des joueureuses présent.es dans le lobby
        socket.on('lobbyPlayers', (playerList) => {
            setPlayers(playerList);
        });

        // Lancement du jeu au click du bouton Start
        socket.on('gameStarted', () => {
            setGameStarted(true);
        });



        // Ecoute pour l'ajout des Parties dans le lobby (si besoin d'un event gameCreated)
        socket.on("gameCreated", (gameData) => {
            setGames(prev => [...prev, gameData]); // ajoute la nouvelle partie créée
        });

        // Réception de la MAJ des parties créés dans le lobby
        socket.on("updateGames", (gamesList) => {
            setGames(gamesList);
        });

        // Fonction de nettoyage : lors du démontage du composant, la socket arrête l'écoute de lobbyPlaers et gameStarted => Evite les doublons
        return() => {
            socket.off('lobbyPlayers');
            socket.off('gameStarted');
            socket.off('gameCreated');
            socket.off('updateGames');
            socket.off('errorMessage');
        };
    }, [lobbyCode, username]);

    const startGame = () => {
    socket.emit('startGame', lobbyCode);
    };

    // }
    useEffect(() => {
        if(gameStarted){
            router.push(`/game/${lobbyCode}`)
        } 
    }, [gameStarted, router, lobbyCode]);


    // Infos du lobby
    return (
    <>
        <Menu />
        <div className={styles.container}>
            {errorMsg && (
                <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 16 }}>{errorMsg}</div>
            )}
            <h1 className={styles.welcome}>Bienvenue dans le lobby : {lobbyCode}</h1>
            <p>Partagez le code du lobby pour que les membres le rejoigne</p>
            {/* <div className={styles.info}>
                <p>Nombre de joueurs du lobby : {players.length}</p>
                <p> | </p>
                <p>Nombre de manches pour la partie : {games.length > 0 ? games[0].tours.length : 0}</p>
            </div> */}
            <div className={styles.ajout}>
                <button className={styles.button} onClick={() => router.push(`/createround/${lobbyCode}`)}>Ajouter une manche</button>
            </div>
            <div className={styles.tableau}>
                <div className={styles.players_container}>
                    <p>Joueur·euses dans le lobby :</p>
                        <ul>
                            {players.map((playerId) => (
                                <li key={playerId}>{playerId}</li>
                            ))}
                        </ul>
                    
                </div>
                <div className={styles.round_container}>
                    <p>Parties disponibles pour le lobby :</p>
                    <ul>
                                        {games.map((game, index) => (
                                            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                Thème : {game.theme}
                                                <button
                                                    style={{ marginLeft: 8, color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                                                    title="Supprimer la partie"
                                                    onClick={() => {
                                                            if(window.confirm('Supprimer cette partie ?')){
                                                                socket.emit('deleteGame', { lobbyCode, gameIndex: index });
                                                            }
                                                        }}
                                                >✖</button>
                                            </li>
                                        ))}
                    </ul>
                </div>
                </div>
            <button className={styles.button} onClick={startGame}>Start</button>
        </div>
    </>
    );
};

export default Lobby;