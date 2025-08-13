import styles from "../styles/createGame.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import Menu from './Menu';
import { useSelector } from 'react-redux';
import socket from '../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';

function CreateGameLocal() {
  const router = useRouter();
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const username = useSelector((state) => state.user.value.username);

  const handleCreate = () => {
        fetch('http://localhost:4000/lobbies/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, state: "private" }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                  console.log(username)
                  socket.emit('joinLobby', {lobbyId: data.code, username});
                  router.push(`/lobby/${data.code}`);
                } 
            })
    };

    const handleBack = () => {
        router.push("/localHostJoin");
    };

  return (
    <>
      <Menu/>
      <div className={styles.container}>
        <div className={styles.back}>
          <button className={styles.backBtn} onClick={handleBack}>
          <FontAwesomeIcon icon={faReply} />
          </button>
        </div>
        <h1 className={styles.create}>Créer une partie en local</h1>

        <p>Nombre de joueurs : {numberOfPlayers}</p>
        <input
          type="range"
          min="1"
          max="10"
          
          value={numberOfPlayers}
          onChange={(e) => setNumberOfPlayers(e.target.value)}
        />

        <p>Nombre de manches : {numberOfRounds}</p>
        <input
          type="range"
          min="1"
          max="10"
          
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

export default CreateGameLocal;

