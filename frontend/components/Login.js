import { useState } from "react";
import styles from "../styles/login.module.css";


const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const openSecondModal = () => setIsSecondModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeSecondModal = () => setIsSecondModalOpen(false);

  return (
    <div className={styles.container}>
      
        <button onClick={openModal} className={styles.button}>
          SE CONNECTER
        </button>
        <button onClick={openSecondModal} className={styles.button}>
          S'INSCRIRE
        </button>
        <button className={styles.button}>INVITÉ</button>
      

      {isModalOpen && (
        <div onClick={closeModal} className={styles.modalOverlay}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContainer}
          >
            <button onClick={closeModal} className={styles.modalCloseButton}>
              &times;
            </button>
            <div className={styles.modalContent}>
              
           <p>Email</p><input></input>
           <p>Mot de passe</p><input ></input>
           <button>SE CONNECTER</button>
             
            </div>
          </div>
        </div>
      )}
      {isSecondModalOpen && (
        <div onClick={closeSecondModal} className={styles.modalOverlay}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContainer}
          >
            <button onClick={closeSecondModal} className={styles.modalCloseButton}>
              &times;
            </button>
            <div className={styles.modalContent}>
            <p>Nom d'utilisateur</p><input></input>
           <p>Email</p><input></input>
           <p>Mot de passe</p><input ></input>
           <button>SE CONNECTER</button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
