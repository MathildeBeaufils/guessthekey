import styles from "../styles/resultatSolo.module.css";
import {useRouter} from "next/router";

import { useDispatch, useSelector } from 'react-redux';
import { deleteTrackId } from "../reducers/missionCampagne";
import { useState, useEffect } from 'react';
import SEO from '../components/SEO'


function ResultatSolo() {
  
    const router = useRouter();
    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

    const user = useSelector((state) => state.user.value);
    const username = useSelector((state) => state.user.value.username);
    const missionId = useSelector((state) => state.missionCampagne.value.missionId);
    const pts = useSelector((state) => state.missionCampagne.value.points);
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(pts);

    useEffect(() => {
      if(points >= 100){
        setTitle('Victoire!')


      if (!username || !missionId) return;
      fetch(`https://guessthekey.onrender.com/missionsCampagne`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, missionId }),
      })
        .then(res => res.json())
        .catch(err => console.error("Erreur fetch:", err));

      }else{
        setTitle('Defaite!')
      }   
      
    }, [username, missionId, title]);

  const dispatch = useDispatch();

  const handleReplay = (e) => {
    dispatch(deleteTrackId())
    router.push('/solo')
  }
  const handleHome = (e) => {
    dispatch(deleteTrackId())
    router.push('/home')
  }

  return (
    <>

      <SEO title="Resultat | Guess The Key" description="Votre mission est terminé, voici votre resultat." />
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>Vous avez obtenu {points} points sur 150</p>
        <button className={styles.button} onClick={handleReplay}>Rejouer</button>
        <button className={styles.button} onClick={handleHome}>Accueil</button>
      </div>
    </>
  );
}

export default ResultatSolo;
