import styles from "../styles/Shop.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faBasketShopping} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/Image'

function Shop() {
  const router = useRouter();

  return (
    <div>
      <Menu />
      <main className={styles.main}>
        <h1 className={styles.title}>BOUTIQUE</h1>

        <div className={styles.layout}>
            <p className={styles.KPbox}>0 KeyPoints</p>
            <div className={styles.skins}>
            <h2>Panoplies complètes</h2>
                <div className={styles.categories}>
                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test1.png" />
                      <span>Valkyrie 2 : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test2.png" />
                      <span>Squelette : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test3.png" />
                      <span>Dark oracle : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test4.png" />
                      <span>Minautore : XX KP</span>
                  </div>
                  </div>

                  <h2>Skins par emplacements</h2>
                <div className={styles.categories}>
                  
                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Head_test3.png" />
                      <span> Tête Squelette : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Head_test2.png" />
                      <span> Tête Minautore : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test1.png" />
                      <span> Haut Valkyrie 2 : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test2.png" />
                      <span>Haut ange : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test3.png" />
                      <span>Haut Dark Oracle : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test4.png" />
                      <span>Haut squelette 2 : XX KP</span>
                  </div>
                </div>
            </div>

            <h2>Acheter des KeyPoints</h2>
            <div className={styles.KPstore}>
              <div className={styles.KPitem}>
                <span className={styles.KP}>1 000KP</span>
                <span>9.99€</span>
              </div>

              <div className={styles.KPitem}>
                <span className={styles.KP}>2 000KP</span>
                <span>19.99€</span>
              </div>

              <div className={styles.KPitem}>
                <span className={styles.KP}>5 000KP</span>
                <span>44.99€</span>
              </div>

              <div className={styles.KPitem}>
                <span className={styles.KP}>10 000KP</span>
                <span>79.99€</span>
              </div>

              <div className={styles.KPitem}>
                <span className={styles.KP}>20 000KP</span>
                <span>149.99€</span>
              </div>
            </div>
            <p className={styles.panier}> <FontAwesomeIcon icon={faBasketShopping} /> Voir mon panier</p>
        </div>
      </main>
    </div>
  );
}

export default Shop;
