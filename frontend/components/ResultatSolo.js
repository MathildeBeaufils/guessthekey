import styles from "../styles/resultatSolo.module.css";
import {useRouter} from "next/router";
import Menu from './Menu';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTrackId } from "../reducers/missionCampagne";
import { useState, useEffect } from 'react';
import SEO from '../components/SEO'


function ResultatSolo() {

    const username = useSelector((state) => state.user.value.username);
    const missionId = useSelector((state) => state.missionCampagne.value.missionId);
    const pts = useSelector((state) => state.missionCampagne.value.points);
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(pts);



    useEffect(() => {
      console.log(points)
      if(points >= 100){
        setTitle('Victoire!')


      if (!username || !missionId) return;
      fetch(`http://localhost:3000/missionsCampagne`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, missionId }),
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error("Erreur fetch:", err));




      }else{
        setTitle('Defaite!')
      }   
      


    }, [username, missionId, title]);



  const dispatch = useDispatch();
  const Router = useRouter();

  const handleReplay = (e) => {
    dispatch(deleteTrackId())
    Router.push('/solo')
  }
  const handleHome = (e) => {
    dispatch(deleteTrackId())
    Router.push('/home')
  }

  return (
    <>
      <SEO title="Resultat | Guess The Key" description="Votre mission est terminé, voici votre resultat." />
      <Menu />
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
