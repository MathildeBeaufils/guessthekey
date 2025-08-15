import styles from '../styles/guessTheKey.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import { useEffect } from "react";

function GuessTheKey() {
    const Router = useRouter();
    const user = useSelector((state) => state.user.value);

    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

    const handleJoin = () => {
        Router.push('/leaderboard')
    };

    return (
        <>
            <Menu/>
            <div className={styles.container}>
                <h1>Guess The Key</h1>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="gameCode">Quel est le point commun ?</label>
                    <input className={styles.input} type="text" placeholder="Entrez le point commun" />
                </div>
                <button className={styles.btn} onClick={handleJoin}>Valider</button>
            </div>        
        </>


    );
}

export default GuessTheKey;