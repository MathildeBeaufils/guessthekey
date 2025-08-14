import styles from "../styles/Quest.module.css";
import Menu from "./Menu";
import quests from "../../backend/collection/quest"
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from "react";

function Quest() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const handleBack = () => {
    router.push("/home");
  };

    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

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
