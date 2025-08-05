import styles from "../styles/hostJoin.module.css";
import {useRouter} from "next/router";

function OnlineLocalHostJoin() {
    const Router = useRouter();
    const handleHost = (e) => {
        Router.push('/creategamemulti')
    }
    const handleJoin = (e) => {
        Router.push('/joingamemulti')
    }
    return (
       <div className={styles.container}>
            <h1 className={styles.title}>Parties</h1>
                <button className={styles.button} onClick={handleHost}>Héberger</button>
                <button className={styles.button} onClick={handleJoin}>Rejoindre</button>
        </div> 
    )
}

export default OnlineLocalHostJoin;