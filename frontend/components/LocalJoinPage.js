import styles from '../styles/localJoinPage.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';

function LocalJoinPage() {
    const Router = useRouter();

    const handleJoin = () => {
        Router.push('/localLobby')
    };

    return (
        <>
            <Menu/>
            <div className={styles.container}>
                <h1>Rejoindre une Partie Locale</h1>
                <div className={styles.inputContainer}>
                    <label htmlFor="gameCode">Code de la Partie :</label>
                    <input className={styles.input} type="text" placeholder="Entrez le code de la partie" />
                </div>
                <button className={styles.btn} onClick={handleJoin}>Valider</button>
            </div>        
        </>


    );
}

export default LocalJoinPage;
