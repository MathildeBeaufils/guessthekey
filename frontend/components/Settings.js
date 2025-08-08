import styles from '../styles/Settings.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh,faPalette, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';


function Settings() {

    const router = useRouter();
    const [volumeGeneral, setVolumeGeneral] = useState(50);
    const [volumeMusique, setVolumeMusique] = useState(50);
    const [volumeSFX, setVolumeSFX] = useState(50);

    /* Fonctionnalité des boutons de paramètres à mettre en place
    const handleRed () {}
    const handleGreen () {}
    const handleBnW () {}
    const handleLink () {}
    const handleDelete () {}
    const handleSecurity () {}
    const handleLogout () {}
    */


  return (
    <div>
      <Menu/>
      <main className={styles.main}>
        <h1 className={styles.title}>PARAMETRES</h1>

        <div className={styles.sonores}>
            <h2> Paramètres sonores</h2>
            <p>Volume général :</p>
            <div className={styles.volume}>
                <FontAwesomeIcon onClick={() => setVolumeMusique(0)} className={styles.volumeIcon} icon={faVolumeXmark}/>
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
                <FontAwesomeIcon onClick={() => setVolumeMusique(0)} className={styles.volumeIcon} icon={faVolumeXmark}/>
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

        <button className={styles.btn} onClick={() => handleLink('lier')}>Lier un compte</button>
        <button className={styles.btn} onClick={() => handleDelete('supprimer')}>Supprimer un compte</button>
        <button className={styles.btn} onClick={() => handleSecurity('confidentialité')}>Confidentialité et sécurité</button>
        <button className={styles.btnLogout} onClick={() => handleLogout('pp')}>Deconnection <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.logoutIcon}/></button>
      </main>
    </div>
  );
}

export default Settings;
