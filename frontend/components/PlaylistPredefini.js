import styles from '../styles/PlaylistPredefini.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import {addTrackId} from '../reducers/missionCampagne'





function PlaylistPredefini(props) {

    function goMission(){
        dispatch(addTrackId({ trackId: props.manches }))
        router.push("/test");   
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
                src="/asset/pngtree-gold-treble-clef-metal-design-melody-vector-png-image_8307084-removebg-preview.png" // {props.image}
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
