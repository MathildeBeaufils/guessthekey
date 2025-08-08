import styles from '../styles/userprofile.module.css';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { login } from '../reducers/users';

function userProfile() {
    const Router = useRouter();
    const dispatch = useDispatch();
    const [inviteUsername, setInviteUsername] = useState('');
    const user = useSelector((state)=>state.user.value);

    const handleJoin = () => {
        dispatch(login({ 
            username: inviteUsername,
        }));
        Router.push('/home')
    };

    return (
        <>
            <div className={styles.container}>
                <span className={styles.KPbox}>0 KeyPoints</span>
                <h1>Votre profil invité</h1>
                <div className={styles.inputContainer}>
                    <label htmlFor="username">Nom d'utilisateur :</label>
                    <input className={styles.input} type="text" placeholder="Entrer un nom d'utilisateur" onChange={(e) => setInviteUsername(e.target.value)}/>
                </div>
                <button className={styles.btn} onClick={handleJoin}>Valider</button>
            </div>        
        </>
    );
}

export default userProfile;
