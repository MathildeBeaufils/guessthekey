import styles from '../styles/Solo.module.css';
import PlaylistPredefini from './PlaylistPredefini';
import { useState } from 'react';
import Menu from './Menu';


// A faire:
// - Mettre les props de l'image
// - Lien vers l'ecoute
// - Adapter le fetch


function Solo() {
    const [facile, setFacile]= useState([]);
    const [moyen, setMoyen]= useState([]);
    const [difficile, setDifficile]= useState([]);

    fetch('http://localhost:3000/missionCampagne')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const facile = [];
        const moyen = [];
        const difficile = [];
        if(data.difficulté === 'facile'){
            facile.push(data[i]);  
            setFacile(facile);                          // voir si on met l'ID ou l'objet
        }else if(data.difficulté === 'moyen'){
            moyen.push(data[i]);                       // voir si on met l'ID ou l'objet
            setMoyen(moyen);              
        }else if(data.difficulté === 'difficile'){
            difficile.push(data[i]);                   // voir si on met l'ID ou l'objet
            setDifficile(difficile);
        }
    })
    .catch((error) => {
        console.error('Erreur lors du fetch :', error);
    });

    const displayFacile = facile.map((data, i) => {
        return <PlaylistPredefini name={data.name} terminer={data.terminer} />;
    });
    const displayMoyen = moyen.map((data, i) => {
        return <PlaylistPredefini name={data.name} terminer={data.terminer} />;
    });
    const displayDifficile = difficile.map((data, i) => {
        return <PlaylistPredefini name={data.name} terminer={data.terminer} />;
    });

    return (
        <div>
            <Menu/>            
            <main className={styles.main}>
                <h1 className={styles.title}>Solo</h1>
                <h2 className={styles.h2}>Facile</h2>
                <div className={styles.ListContainer}>
                    {displayFacile}
                    <PlaylistPredefini name={'toto'} terminer={true}/>
                    <PlaylistPredefini name={'tata'} terminer={true}/>
                    <PlaylistPredefini name={'titi'} terminer={true}/>
                    <PlaylistPredefini name={'tutu'}/>
                    <PlaylistPredefini name={'toto'}/>
                    <PlaylistPredefini name={'tata'}/>
                    <PlaylistPredefini name={'titi'} terminer={true}/>
                    <PlaylistPredefini name={'tutu'}/>
                </div>
                <h2 className={styles.h2}>Moyen</h2>
                <div className={styles.ListContainer}></div>
                <h2 className={styles.h2}>Difficile</h2> 
                <div className={styles.ListContainerLast}></div>           


            </main>
        </div>
    );
}

export default Solo;
