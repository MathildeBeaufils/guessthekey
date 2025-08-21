import styles from '../styles/PlaylistPredefini.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import {addTrackId} from '../reducers/missionCampagne.js'





function PlaylistPredefini(props) {

    function goMission(){
        dispatch(addTrackId({ trackId: props.manches, missionId: props.id }))
        router.push("/gameSolo");   
    }

    const dispatch = useDispatch();
    const router = useRouter();
    let afficheTerminer = null;
    if(props && props.terminer){
        afficheTerminer = <FontAwesomeIcon icon={faCheck} className={styles.check} />
    }
    return (
        <div className={styles.btn} onClick={goMission}>
            {afficheTerminer}
            <Image
                src="/cleDeSol.png" // {props.image}
                alt="Logo clé de sol"
                width={10}
                height={60}
            />
            <hr className={styles.barre}></hr>
            <p>{props.name}</p>
        </div>
    )
}

export default PlaylistPredefini;
