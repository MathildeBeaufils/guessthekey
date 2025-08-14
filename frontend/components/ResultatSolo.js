import styles from "../styles/resultatSolo.module.css";
import {useRouter} from "next/router";
import Menu from './Menu';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTrackId } from "../reducers/missionCampagne";
import { useState, useEffect } from 'react';
import SEO from '../components/SEO'


// A faire
// - Mettre a jour si gagner en bdd + reducer user
// - verifier si la mission terminee passe a true (probleme route)




function ResultatSolo() {

    const username = useSelector((state) => state.user.value.username);
    const missionId = useSelector((state) => state.missionCampagne.value.missionId);
    const points = useSelector((state) => state.missionCampagne.value.points);
    const [title, setTitle] = useState('');



    useEffect(() => {
      console.log(points)
      if(points >= 100){
        setTitle('Victoire!')
      }else{
        setTitle('Defaite!')
      }   
      
      if (!username || !missionId) return;
    
    fetch(`http://localhost:3000/missionsCampagne`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, missionId }),
      }).then(data=>console.log(data))

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
        <p className={styles.text}>Vous avez obtenu 100 points sur 150</p>
        <button className={styles.button} onClick={handleReplay}>Rejouer</button>
        <button className={styles.button} onClick={handleHome}>Accueil</button>
      </div>
    </>
  );
}

export default ResultatSolo;
