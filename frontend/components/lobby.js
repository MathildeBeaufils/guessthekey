import React, { useEffect, useState, useRef } from 'react';
import Menu from "./Menu";
import { useSelector } from 'react-redux';
import { useRouter} from 'next/router';
import styles from "../styles/lobby.module.css";
console.log('Tentative de connexion socket...');
import socket from '../socket';
const Lobby = () => {
    const router = useRouter();
    const { code } = router.query;
    const username = useSelector((state) => state.user.value.username);

useEffect(() => {
    setLobbyId(code);
    //Connexion à un lobby existant via son ID
    socket.emit('joinLobby', {lobbyId});
}, [code])


    useEffect(() => {
        if (lobbyCode) {
            setLobbyId(lobbyCode);
            socket.emit('joinLobby', {lobbyId: lobbyCode, username});
        }
    }, [lobbyCode]);
    
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
    <>
        <Menu />
        <div className={styles.container}>
            
            <h1 className={styles.welcome}>Bienvenue dans le lobby : {lobbyId}</h1>
            <p>Partagez le code du lobby pour que les membres le rejoigne</p>
            <div className={styles.info}>
                <p>Nombre de joueurs du lobby : X / X</p>
                <p> | </p>
                <p>Nombre de manche pour la partie : Y/Y</p>
            </div>
            <div className={styles.ajout}>
                <button className={styles.button}>Ajouter un membre</button>
                <button className={styles.button} >Ajouter une manche</button>
            </div>
            <div className={styles.tableau}>
                <div className={styles.players_container}>
                    <p>Joueur·euses dans le lobby :</p>
                    
                        {players.map((playerId) => (
                        <ul key={playerId}>{playerId}</ul>
                        ))}
                    
                </div>
                <div className={styles.round_container}>
                    <p>Manches disponibles pour le lobby :</p>
                    {manchesDispo.map((mancheId) => (
                        <span key={mancheId}>{mancheId}</span>
                    ))}
                </div>
                </div>
            <button className={styles.button} onClick={startGame}>Lancer la partie</button>
        </div>
    </>
    );
};

export default Lobby;