import styles from "../styles/Shop.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faBasketShopping} from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";

import SEO from '../components/SEO'
import { useSelector } from 'react-redux';

function Shop() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);

    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

  return (
    <>
      <SEO title="Magasin | Guess The Key" description="Acheter des objets pour paraitre au dessus de vos amis" />
      <Menu />
      <main className={styles.main}>
        <h1 className={styles.title}>BOUTIQUE</h1>

        <div className={styles.layout}>
            <p className={styles.KPbox}>0 KeyPoints</p>
            <div className={styles.skins}>
            <h2>Panoplies complètes</h2>
                <div className={styles.categories}>
                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test1.png" alt='image dun article'/>
                      <span>Valkyrie 2 : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test2.png" alt='image dun article' />
                      <span>Squelette : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test3.png" alt='image dun article' />
                      <span>Dark oracle : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/perso_test4.png"  alt='image dun article'/>
                      <span>Minautore : XX KP</span>
                  </div>
                  </div>

                  <h2>Skins par emplacements</h2>
                <div className={styles.categories}>
                  
                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Head_test3.png"  alt='image dun article'/>
                      <span> Tête Squelette : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Head_test2.png"  alt='image dun article'/>
                      <span> Tête Minautore : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test1.png" alt='image dun article' />
                      <span> Haut Valkyrie 2 : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test2.png" alt='image dun article' />
                      <span>Haut ange : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test3.png" alt='image dun article' />
                      <span>Haut Dark Oracle : XX KP</span>
                  </div>

                  <div className={styles.item}>
                      <img className={styles.imgItem} src="/Body_test4.png" alt='image dun article' />
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
    </>
  );
}

export default Shop;
