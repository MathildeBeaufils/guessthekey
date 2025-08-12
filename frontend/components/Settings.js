import styles from '../styles/Settings.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useState,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh,faPalette, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUsername } from '../reducers/users';


function Settings() {



  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user.value);
  const backendUrl = "http://localhost:3000";
  const router = useRouter();
  const [volumeGeneral, setVolumeGeneral] = useState(50);
  const [volumeMusique, setVolumeMusique] = useState(50);
  const [volumeSFX, setVolumeSFX] = useState(50);
  const [newName, setNewName]= useState('');
  const [newPassword, setNewPassword]= useState('');

    /* Fonctionnalité des boutons de paramètres à mettre en place
    const handleRed () {}
    const handleGreen () {}
    const handleBnW () {}
    const handleLink () {}
    const handleSecurity () {}
    */

  // Verifi que seul les user authentifier puisse acceder a al apage
  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token]);



  // logout
  function handleLogout(){
    dispatch(logout);
    router.push('/');
  }
  
  // Delete compte
  function handleDelete() {
    const email = user.email;
    fetch(`http://localhost:3000/users/deleteUser/${email}`, {
      method: "DELETE",
    })
    .then(res => res.json())
    .then(() => {
      dispatch(logout());
      router.push('/');
    })
    .catch(err => console.error("Erreur DELETE:", err));
  }

  // update Username
  function changeName() {
    const item = {
      username : user.username,
      newUsername : newName    
    }

    fetch(`${backendUrl}/users/updateUsername`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      })
      .then(response => response.json())
      .then(data => {
          if(data.result === true){
            dispatch(updateUsername({username:newName}))
          }
    })
    .catch(error => console.error("Erreur :", error));
  }


  // Update Password
  function changePassword() {
    const item = {
      email : user.email,
      newPassword : newPassword    
    }

    fetch(`${backendUrl}/users/updatePassword`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      })
      .then(response => response.json())
    .catch(error => console.error("Erreur :", error));
  }


  return (
    <div>
      <Menu/>
      <main className={styles.main}>
        <h1 className={styles.title}>PARAMETRES</h1>

        <div className={styles.sonores}>
            <h2> Paramètres sonores</h2>
            <p>Volume général :</p>
            <div className={styles.volume}>
                <FontAwesomeIcon onClick={() => setVolumeGeneral(0)} className={styles.volumeIcon} icon={faVolumeXmark}/>
                <input
                className={styles.cursor}
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                value={volumeGeneral}
                onChange={(e) => setVolumeGeneral(e.target.value)}
                />
                <FontAwesomeIcon icon={faVolumeHigh} className={styles.volumeIcon} onClick={() => setVolumeGeneral(100)} />
            </div>

            <p>Volume musique :</p>
            <div className={styles.volume}>
                <FontAwesomeIcon onClick={() => setVolumeMusique(0)} className={styles.volumeIcon} icon={faVolumeXmark}/>
                <input
                className={styles.cursor}
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                value={volumeMusique}
                onChange={(e) => setVolumeMusique(e.target.value)}
                />
                <FontAwesomeIcon icon={faVolumeHigh} className={styles.volumeIcon} onClick={() => setVolumeMusique(100)} />
            </div>

            <p>Volume SFX :</p>
            <div className={styles.volume}>
                <FontAwesomeIcon onClick={() => setVolumeSFX(0)} className={styles.volumeIcon} icon={faVolumeXmark}/>
                <input
                className={styles.cursor}
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                value={volumeSFX}
                onChange={(e) => setVolumeSFX(e.target.value)}
                />
                <FontAwesomeIcon icon={faVolumeHigh} className={styles.volumeIcon} onClick={() => setVolumeSFX(100)} />
            </div>
        </div>

        <div className={styles.affichage}>
          <h3> Paramètres d'affichage</h3>
          <div className={styles.couleurs}>

            <FontAwesomeIcon icon={faPalette} className={styles.paletteIcon}/>

            <button className={styles.btnCouleurs} onClick={() => handleRed('rouge')}>
              <img  src="/affichageRed.png" alt={"Affichage Rouge"} className={styles.affichageIcon}/>
            </button>

            <button className={styles.btnCouleurs} onClick={() => handleGreen('vert')}>
              <img  src="/affichageGreen.png" alt={"Affichage Rouge"} className={styles.affichageIcon}/>
            </button>

            <button className={styles.btnCouleurs} onClick={() => handleBnW('BnW')}>
              <img  src="/affichageBnW.png" alt={"Affichage Noir et Blanc"} className={styles.affichageIcon}/>
            </button>
            
            </div>
        </div>

        <div className={styles.profil}>
          <h3>Profil utilisateur</h3>
          <div className={styles.inputContaire}>
            <div  className={styles.unInput}>
              <label>
                Changer de nom d'utilisateur:<br></br>
                <input
                  type="text"
                  className={styles.inputrecherche}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={user.username}
                  required
                />
              </label>
              <button onClick={changeName} className={styles.Btnrecherche} >Valider username</button>    
            </div>
            <div>
              <label>
                Changer de mot de passe:<br></br>
                <input
                  type="password"
                  className={styles.inputrecherche}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Mot de passe'
                  required
                />
              </label>
              <button onClick={changePassword} className={styles.Btnrecherche} >Valider Mot de passe</button>   
              
            </div>
          </div>
        </div>

        <button className={styles.btn} onClick={() => handleLink('lier')}>Lier un compte</button>
        <button className={styles.btn} onClick={() => handleDelete()}>Supprimer un compte</button>
        <button className={styles.btn} onClick={() => handleSecurity('confidentialité')}>Confidentialité et sécurité</button>
        <button className={styles.btnLogout} onClick={() => handleLogout()}>Deconnection <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.logoutIcon}/></button>
      </main>
    </div>
  );
}

export default Settings;
