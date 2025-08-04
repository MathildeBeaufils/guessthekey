import styles from '../styles/Menu.module.css';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faCartPlus, faShirt, faGear} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// A faire:
// - Mettre a jour les liens

function Menu() {
    return (    
        <nav className={styles.nav}>
            <Link href="/shop">            
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faCartPlus} />
                    <p>BOUTIQUE</p>
                </div>
            </Link>

            <Link href="/home">
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faMusic} />
                    <p>PARTIES</p>
                </div>
            </Link>

            <Link href="/">
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faShirt} />
                    <p>PERSONNALISATION</p>
                </div>
            </Link>

            <Link href="/">
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faGear} />
                    <p>REGLAGES</p>
                </div>
            </Link>            
        </nav>

    );
}

export default Menu;
