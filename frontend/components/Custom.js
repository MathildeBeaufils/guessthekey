import styles from "../styles/Custom.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function Custom() {
  const router = useRouter();


  return (
    <div>
      <Menu />
      <main className={styles.main}>
        <h1 className={styles.title}>PERSONNALISATION</h1>

        <div className={styles.layout}>
            
            <div className={styles.items}>
                <span>Inventaire</span>
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
                    <img className={styles.imgPerso} src="/perso_test1.png" />
                </div>
            </div>
        </div>
        <Link href="/shop" ><p className={styles.lienShop}>Visitez le <FontAwesomeIcon icon={faCartPlus} />store pour plus de choix de personnalisation</p></Link>
      </main>
    </div>
  );
}

export default Custom;
