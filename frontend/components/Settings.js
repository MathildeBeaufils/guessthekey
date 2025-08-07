import styles from '../styles/Settings.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh,faPalette } from '@fortawesome/free-solid-svg-icons';


function Settings() {

    const router = useRouter();
    const [volumeGeneral, setVolumeGeneral] = useState(50);
    const [volumeMusique, setVolumeMusique] = useState(50);
    const [volumeSFX, setVolumeSFX] = useState(50);

    const handleSubmit = (page) => {
        if(page === 'solo'){
        // vers page solo
        router.push('/solo')
        }else if(page === 'multi'){
        // vers page multi
        Router.push('/onlineHostJoin');
        }else{
        // vers page parties privées      
        Router.push('/localHostJoin');      
        }
    };

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
          <FontAwesomeIcon icon={faPalette} />
          <image  src="/affichageRed.png" alt={"Affichage Rouge"} className={styles.affichageIcon}/>
        </div>

        <button className={styles.btn} onClick={() => handleSubmit('solo')}>Lier un compte</button>
        <button className={styles.btn} onClick={() => handleSubmit('multi')}>Supprimer un compte</button>
        <button className={styles.btn} onClick={() => handleSubmit('pp')}>Deconnection</button>
      </main>
    </div>
  );
}

export default Settings;
