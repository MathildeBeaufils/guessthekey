import styles from "../styles/hostJoin.module.css";
import {useRouter} from "next/router";
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';

function LocalHostJoin() {
    const router = useRouter();
    const handleHost = (e) => {
        router.push('/creategamelocal')
    }
    const handleJoin = (e) => {
        router.push('/joingamelocal')
    }
    const handleBack = () => {
        router.push("/home");
    };
    return (
        <>
            <Menu/>     
            <div className={styles.container}>
                <div className={styles.back}>
                    <button className={styles.backBtn} onClick={handleBack}>
                    <FontAwesomeIcon icon={faReply} />
                    </button>
                </div>
                <h1 className={styles.title}>Parties</h1>
                    <button className={styles.button} onClick={handleHost}>Héberger</button>
                    <button className={styles.button} onClick={handleJoin}>Rejoindre</button>
            </div>         
        </>

    )
}

export default LocalHostJoin;