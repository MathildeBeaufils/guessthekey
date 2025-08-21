import styles from "../styles/online.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Menu from './Menu';
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function Online() {
  const router = useRouter();
  const [inProgress, setInProgress] = useState([]);
  const user = useSelector((state) => state.user.value);


  // Verifi que seul les user authentifier puisse acceder a la page
  useEffect(() => {
      if (!user.token) {
      router.push('/');
      }
  }, [user]);

  useEffect(() => {
  fetch(`https://guessthekey.onrender.com/lobbies`)
    .then(response => response.json())
    .then(data => {
      if(data.result === false){
        setInProgress(data.message)
      } else { 
        setInProgress(data.lobbies) }
    });
  }, [])

  const handleJoin = (code) => {
    router.push(`/lobby/${code}`);
  };

  let lobbyList = inProgress.map((lobby) => {
    if(lobby === 0){
      return <p> Pas de partie public en cours</p>
    } else {
      <div key={lobby.code} className={styles.game_user}>
        <p>Catégorie</p>
        <p>{lobby.players.length}</p>
        <button className={styles.button_join} onClick={() => handleJoin(lobby.code)}> Join</button>
      </div>
    }
  })

  const handleBack = () => {
    router.push("/onlineHostJoin");
    };

  return (
    <>
      <SEO title="Recherche de partie | Guess The Key" description="Rejoingnez une partie." />
      <Menu/>
      <div className={styles.container}>
        <div className={styles.back}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon icon={faReply} />
          </button>
        </div>
        <h1 className={styles.create}>Recherche de parties en ligne</h1>
        <div className={styles.game_container}>
          {lobbyList}
        </div>
      </div>
    </>
  );
}

export default Online;
