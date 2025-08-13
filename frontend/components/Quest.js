import styles from "../styles/Quest.module.css";
import Menu from "./Menu";
import quests from "../../backend/collection/quest"
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

function Quest() {
  const router = useRouter();
  const handleBack = () => {
    router.push("/home");
  };
  return (
    <>
      <SEO title="Quetes | Guess The Key" description="Liste de vos quetes." />
      <Menu />
      <div className={styles.container}>
        <div className={styles.back}>
          <button className={styles.backBtn} onClick={handleBack}>
          <FontAwesomeIcon icon={faReply} />
          </button>
        </div>
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
