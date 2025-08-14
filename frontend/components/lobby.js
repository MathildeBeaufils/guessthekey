import React, { useEffect, useState, useRef } from 'react';
import Menu from "./Menu";
import { useSelector } from 'react-redux';
import { useRouter} from 'next/router';
import styles from "../styles/lobby.module.css";
console.log('Tentative de connexion socket...');
import socket from '../socket';

//zuuuuuuut
const Lobby = ({lobbyCode}) => {
    const router = useRouter();
    const { code } = router.query;
    const username = useSelector((state) => state.user.value.username);
    const user = useSelector((state) => state.user.value);

    const [lobbyId, setLobbyId] = useState("NomduLobby");
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState({})


    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);


    useEffect(() => {
        if (lobbyCode) {
            setLobbyId(lobbyCode);
            socket.emit('joinLobby', {lobbyId: lobbyCode, username});
        }
    }, [lobbyCode]);
    
    useEffect(() => {    
        // Mise à jour des joueureuses présent.es dans le lobby
        socket.on('lobbyPlayers', (playerList) => {
            setPlayers(playerList);
        });
        // Lancement de la partie au click du bouton
        socket.on('gameStarted', () => {
            console.log("Ceci est un start game");
            setGameStarted(true);
        });

        // Fonction de nettoyage : lors du démontage du composant, la socket arrête l'écoute de lobbyPlaers et gameStarted => Evite les doublons
        return() => {
            socket.off('lobbyPlayers');
            socket.off('gameStarted');
        };
    }, []);

    // Ecoute pour l'ajout des manches dans le lobby
        useEffect(() => {
            socket.on("roundCreated", (roundData) => {
              setRounds(prev => [...prev, roundData]); // ajoute la manche reçue
              console.log("lobby round created :" + rounds)
            });
        
            return () => {
            socket.off("roundCreated");
            };
        }, []);

        useEffect(() => {
            // Réception de la MAJ des rounds créés dans le lobby
            socket.on("updateRounds", (roundsList) => {
                console.log("Manches disponibles :", roundsList);
                setRounds(roundsList);
            });
        
            return () => {
                socket.off("updateRounds");
            };
        }, []);

    const startGame = () => {
        console.log(`Lancement de la partie pour le lobby ${lobbyId}`)
        socket.emit('startGame', lobbyId);
    };

    const handleSelect =(selectedRound) => {
        console.log(`Partie sélectionnée:`, selectedRound)
        setSelectedRound(selectedRound)

    }
    useEffect(() => {
        if(gameStarted){
            console.log('Redirection vers la partie')
            router.push(`/game/${lobbyId}`)
        } 
    }, [gameStarted, code, router]);


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
                <button className={styles.button} onClick={() => router.push(`/createround/${lobbyId}`)}>Ajouter une manche</button>
            </div>
            <div className={styles.tableau}>
                <div className={styles.players_container}>
                    <p>Joueur·euses dans le lobby :</p>
                        {players.map((playerId) => (
                            
                            <ul>
                                <li key={playerId}>{playerId}</li>
                            </ul>
                        ))}
                    
                </div>
                <div className={styles.round_container}>
                    <p>Manches disponibles pour le lobby :</p>
                    
                    {rounds.map((round, index) => {
                        const themeRound = round.manche.theme;
                        return (
                        <ul key={index}>
                            <li>
                            {themeRound}
                            <button onClick={() => handleSelect(round)}>Choisir</button>
                            </li>
                        </ul>
                        );
                    })}
                    
                </div>
                </div>
            <button className={styles.button} onClick={startGame}>Lancer la partie</button>
        </div>
    </>
    );
};

export default Lobby;