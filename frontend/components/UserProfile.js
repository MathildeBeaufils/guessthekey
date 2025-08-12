import styles from '../styles/userprofile.module.css';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { login } from '../reducers/users';

function userProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [inviteUsername, setInviteUsername] = useState('');
    const user = useSelector((state)=>state.user.value);
    const backendUrl = "http://localhost:3000/users";

    const handleJoin = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}/guessSignup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: inviteUsername,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur de connexion");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(login({ 
          token: data.data.token, 
          username: data.data.username,
          email: data.data.email,
          itemJambes: data.data.itemJambes,
          itemPieds: data.data.itemPieds,
          itemTete: data.data.itemTete,
          itemTorse: data.data.itemTorse,
          keyPoint: data.data.keyPoint,
          nbVictoire: data.data.nbVictoire,
          isAdmin: data.data.isAdmin,
        }));
        router.push("/home")
      })
      .catch((error) => {
        console.error("Échec de la connexion :", error);
      });
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
