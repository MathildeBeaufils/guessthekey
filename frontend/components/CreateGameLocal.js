import styles from "../styles/createGame.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import Menu from './Menu';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

function CreateGameSolo() {
  const router = useRouter();
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const username = useSelector((state) => state.user.username);

  const handleCreate = () => {
        fetch('http://localhost:3000/lobbies/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                  socket.emit('joinLobby', data.code);
                  router.push(`/lobby/${data.code}`);
                } 
            })
    };

  return (
    <>
      <Menu/>
      <div className={styles.container}>
        <h1 className={styles.create}>Créer une partie en local</h1>

        <p>Nombre de joueurs : {numberOfPlayers}</p>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue="5"
          value={numberOfPlayers}
          onChange={(e) => setNumberOfPlayers(e.target.value)}
        />

        <p>Nombre de manches : {numberOfRounds}</p>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue="5"
          value={numberOfRounds}
          onChange={(e) => setNumberOfRounds(e.target.value)}
        />

        <button className={styles.button} onClick={handleCreate}>
          Créer une partie
        </button>
      </div>
    </>
  );
}

export default CreateGameSolo;
