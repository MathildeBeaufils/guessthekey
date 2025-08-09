import styles from "../styles/Shop.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';
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
          <h2>Skins personnage</h2>
            <div className={styles.skins}>

                <div className={styles.item}>
                    <img className={styles.imgItem} src="/Head_test1.png" />
                    <span>Valkyrie 2 : XX KP</span>
                </div>

                <div className={styles.item}>
                    <img className={styles.imgItem} src="/Head_test2.png" />
                    <span>Minautore : XX KP</span>
                </div>

                <div className={styles.item}>
                    <img className={styles.imgItem} src="/Head_test1.png" />
                    <span>Valkyrie 2 : XX KP</span>
                </div>

                <div className={styles.item}>
                    <img className={styles.imgItem} src="/Head_test2.png" />
                    <span>Minautore : XX KP</span>
                </div>
            </div>

            <h2>Acheter des KeyPoints</h2>
            <div className={styles.KPstore}>
              <div className={styles.item}>
                <span>1000KP</span>
                <span>9.99€</span>
              </div>

              <div className={styles.item}>
                <span>2000KP</span>
                <span>19.99€</span>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Shop;
