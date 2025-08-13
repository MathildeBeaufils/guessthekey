import styles from '../styles/Solo.module.css';
import PlaylistPredefini from './PlaylistPredefini';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import { useSelector } from 'react-redux';


// A faire:
// - Mettre les props de l'image
// - Lien vers l'ecoute


function Solo() {
    const user = useSelector((state)=>state.user.value);
    const [facile, setFacile]= useState([]);
    const [moyen, setMoyen]= useState([]);
    const [difficile, setDifficile]= useState([]);

    useEffect(() => {

        fetch(`http://localhost:3000/missionsCampagne/${user.token}`)
        .then((response) => response.json())
        .then((data) => {
            const arr = data.data;
            const facile = [];
            const moyen = [];
            const difficile = [];
        for (let i = 0; i < arr.length; i++) { 
            const mission = arr[i];             

            if (mission.difficulte === 'facile') {
                facile.push(mission);
                setFacile(facile); 
            } else if (mission.difficulte === 'moyen') {
                moyen.push(mission);
                setMoyen(moyen);
            } else if (mission.difficulte === 'difficile') {
                difficile.push(mission);
                setDifficile(difficile);
            }
        }
        })
        .catch((error) => {
            console.error('Erreur lors du fetch :', error);
        });

    }, []); 

    const displayFacile = facile.map((data, i) => {
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} id={data._id}/>;
    });
    const displayMoyen = moyen.map((data, i) => {
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} id={data._id}/>;
    });
    const displayDifficile = difficile.map((data, i) => {
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} id={data._id}/>;
    });

    return (
        <div>
            <Menu/>            
            <main className={styles.main}>
                <h1 className={styles.title}>Solo</h1>
                <h2 className={styles.h2}>Facile</h2>
                <div className={styles.ListContainer}>
                    {displayFacile}
                </div>
                <h2 className={styles.h2}>Moyen</h2>
                <div className={styles.ListContainer}>
                    {displayMoyen}
                </div>
                <h2 className={styles.h2}>Difficile</h2> 
                <div className={styles.ListContainerLast}>
                    {displayDifficile}
                </div>           
            </main>
        </div>
    );
}

export default Solo;
