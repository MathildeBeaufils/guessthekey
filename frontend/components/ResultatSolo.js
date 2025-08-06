import styles from "../styles/resultatSolo.module.css";
import {useRouter} from "next/router";
import Menu from './Menu';

function ResultatSolo() {
  const Router = useRouter();

  const handleNext = (e) => {
    Router.push('/nextLevel')
  }
  const handleReplay = (e) => {
    Router.push('/replay')
  }
  const handleHome = (e) => {
    Router.push('/home')
  }

  return (
    <>
      <Menu />
      <div className={styles.container}>
        <h1 className={styles.title}>Victoire!</h1>
        <p className={styles.text}>Vous avez obtenu 100 Key Points</p>
        <button className={styles.button} onClick={handleNext}>Niveau suivant</button>
        <button className={styles.button} onClick={handleReplay}>Rejouer</button>
        <button className={styles.button} onClick={handleHome}>Accueil</button>
      </div>
    </>
  );
}

export default ResultatSolo;
