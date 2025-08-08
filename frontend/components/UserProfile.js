import styles from '../styles/userprofile.module.css';
import { useRouter } from 'next/router';

function userProfile() {
    const Router = useRouter();

    const handleJoin = () => {
        Router.push('/home')
    };

    return (
        <>
            <div className={styles.container}>
                <span className={styles.KPbox}>0 KeyPoints</span>
                <h1>Votre profil invité</h1>
                <div className={styles.inputContainer}>
                    <label htmlFor="username">Nom d'utilisateur :</label>
                    <input className={styles.input} type="text" placeholder="Entrer un nom d'utilisateur" />
                </div>
                <button className={styles.btn} onClick={handleJoin}>Valider</button>
            </div>        
        </>


    );
}

export default userProfile;
