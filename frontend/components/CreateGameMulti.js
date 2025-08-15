import styles from "../styles/createGame.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Menu from './Menu';
import { useSelector } from 'react-redux';
import socket from '../socket';
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';


function CreateGameMulti() {
  const router = useRouter();
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const username = useSelector((state) => state.user.value.username);
  const user = useSelector((state) => state.user.value);
  const [showModal, setShowModal] = useState(!user?.isSignedUp);


    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);
  
  const handleCreate = () => {
    fetch('http://localhost:3000/lobbies/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, state: "public" }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.result) {
              socket.emit('joinLobby', {lobbyId: data.code, username});
              router.push(`/lobby/${data.code}`);
            } 
        })
};

  const handleBack = () => {
        router.push("/onlineHostJoin");
  };

  return (
    <>
      <SEO title="Creer une partie en ligne | Guess The Key" description="Parametrez votre partie." />
      <Menu/>
      <div className={styles.container} style={showModal ? { filter: 'blur(6px)', pointerEvents: 'none' } : {}}>
        <div className={styles.back}>
          <button className={styles.backBtn} onClick={handleBack}>
          <FontAwesomeIcon icon={faReply} />
          </button>
        </div>
        <h1 className={styles.create}>Créer une partie en multijoueurs</h1>


        <label className={styles.label}>
          <p>Nombre de joueurs : {numberOfPlayers}</p>
          <input
            className={styles.inputRange}
            type="range"
            min="1"
            max="10"
            defaultValue="5"
            value={numberOfPlayers}
            onChange={(e) => setNumberOfPlayers(e.target.value)}
          />          
        </label>


        <label className={styles.label}>
          <p>Nombre de manches : {numberOfRounds}</p>
          <input
            className={styles.inputRange}
            type="range"
            min="1"
            max="10"
            defaultValue="5"
            value={numberOfRounds}
            onChange={(e) => setNumberOfRounds(e.target.value)}
          />          
        </label>


        <button className={styles.button} onClick={handleCreate}>
          Créer une partie
        </button>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              onClick={handleBack}
              className={styles.closeBtn}
            >
              &times;
            </button>
            <h2>ACCES RESERVE</h2>
            <p>Vous devez vous inscrire ou vous connecter pour accéder à cette page.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateGameMulti;
