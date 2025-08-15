import styles from "../styles/Quest.module.css";
import Menu from "./Menu";
import quests from "../../backend/collection/quest"
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useState } from "react";
import { useSelector } from "react-redux";

function Quest() {
  const router = useRouter();
  const user = useSelector((state)=>state.user.value);
  const [showModal, setShowModal] = useState(!user?.isSignedUp);

  const handleBack = () => {
    router.push("/home");
  };

  return (
    <>
      <SEO title="Quetes | Guess The Key" description="Liste de vos quetes." />
      <Menu />
      <div className={styles.container} style={showModal ? { filter: 'blur(6px)', pointerEvents: 'none' } : {}}>
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

export default Quest;
