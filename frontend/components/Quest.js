import styles from "../styles/Quest.module.css";
import Menu from "./Menu";

function Quest() {
  return (
    <><Menu/>
      <div className={styles.container}>
        <h1>QUÊTES</h1>
        <div className={styles.quest_container}>
          <div >
            <p>Quête 1 : Débuts prometteurs !</p>
            <p className={styles.quest}>Gagne une partie de blindtest pour la première fois.</p>
          </div>
          <div >
            <p>Quête 2 : Flash Écoute</p>
            <p className={styles.quest}>Répondre correctement (titre ou artiste) dans les 5 premières secondes.</p>
          </div>
          <div >
            <p>Quête 3 : Le Jukebox vivant</p>
            <p className={styles.quest}>Avoir 50 bonnes réponses différentes (titre ou artiste).</p>
          </div>
          <div >
            <p>Quête 4 : Série enflammée</p>
            <p className={styles.quest}>Trouve 5 chansons d'affilée sans erreur.</p>
          </div>
          <div >
            <p>Quête 5 : Keymaster</p>
            <p className={styles.quest}>Trouve correctement le point commun ("guess the key") entre les chansons d'une partie.</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Quest;
