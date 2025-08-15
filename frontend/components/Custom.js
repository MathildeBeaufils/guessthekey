import styles from "../styles/Custom.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SEO from '../components/SEO'
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Custom() {
  const router = useRouter();
  const user = useSelector((state)=>state.user.value);
  const [showModal, setShowModal] = useState(!user?.isSignedUp);

  const handleBack = () => {
        router.push("/home");
    };

  return (
    <>
      <SEO title="Personnalisation | Guess The Key" description="Personnalisez votre personnage" />
      <Menu />
      <main className={styles.main} style={showModal ? { filter: 'blur(6px)', pointerEvents: 'none' } : {}}>
        <h1 className={styles.title}>PERSONNALISATION</h1>

        <div className={styles.layout}>
            
            <div className={styles.items}>
                <span className={styles.Inventaire}>Inventaire</span>
                <div className={styles.tete}>
                    <span>Tête</span>
                </div>

                <div className={styles.haut}>
                    <span>Haut du corps</span>
                </div>

                <div className={styles.bas}>
                    <span>Bas du corps</span>
                </div>

                <div className={styles.pied}>
                    <span>Chaussures</span>
                </div>
                
            </div>

            <div className={styles.perso}>
                <span>Votre personnage</span>
                <div className={styles.image}>
                    <img className={styles.imgPerso} src="/perso_test1.png" alt='image de votre personnage'/>
                </div>
            </div>
        </div>
        <Link href="/shop" ><p className={styles.lienShop}>Visitez le <FontAwesomeIcon icon={faCartPlus} />store pour plus de choix de personnalisation</p></Link>
      </main>
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

export default Custom;
