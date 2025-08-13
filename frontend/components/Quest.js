import styles from "../styles/Quest.module.css";
import Menu from "./Menu";
import quests from "../../backend/collection/quest"
import SEO from '../components/SEO'

function Quest() {
  return (
    <>
      <SEO title="Quetes | Guess The Key" description="Liste de vos quetes." />
      <Menu />
      <div className={styles.container}>
        <h1>QUÊTES</h1>
        <div className={styles.quest_container}>
          {quests.map((quest) => (
            <div key={quest.id}>
              <p>Quête {quest.id} : {quest.title}</p>
              <p className={styles.quest}>{quest.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Quest;
