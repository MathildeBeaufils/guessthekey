import styles from '../styles/Solo.module.css';
import PlaylistPredefini from './PlaylistPredefini';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTrackId } from "../reducers/missionCampagne";
import SEO from '../components/SEO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/router";


function Solo() {

    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

    const dispatch = useDispatch();
    // supprime du reducer la track en cour
    dispatch(deleteTrackId())
    const user = useSelector((state)=>state.user.value);
    
    const [facile, setFacile]= useState([]);
    const [moyen, setMoyen]= useState([]);
    const [difficile, setDifficile]= useState([]);
    const router = useRouter();

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
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} manches={data.manches} id={data._id}/>;
    });
    const displayMoyen = moyen.map((data, i) => {
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} manches={data.manches} id={data._id}/>;
    });
    const displayDifficile = difficile.map((data, i) => {
        return <PlaylistPredefini key={[i]} name={data.nom} image={data.image} terminer={data.terminee} manches={data.manches} id={data._id}/>;
    });

    const handleBack = () => {
        router.push("/home");
    };

    return (
        <>
            <SEO title="Campagne | Guess The Key" description="Selectionnez une mission pour jouer." />
            <Menu/>            
            <main className={styles.main}>
                <div className={styles.back}>
                    <button className={styles.backBtn} onClick={handleBack}>
                    <FontAwesomeIcon icon={faReply} />
                    </button>
                </div>
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
        </>
    );
}

export default Solo;
