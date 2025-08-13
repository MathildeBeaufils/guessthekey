import styles from "../styles/hostJoin.module.css";
import {useRouter} from "next/router";
import Menu from './Menu';
import SEO from '../components/SEO'

function OnlineLocalHostJoin() {
    const Router = useRouter();
    const handleHost = (e) => {
        Router.push('/creategamemulti')
    }
    const handleJoin = (e) => {
        Router.push('/onlinepage')
    }
    return (
        <>
            <SEO title="Multijoueur | Guess The Key" description="Hebergez ou rejoingnez une partie pour plus de fun." />   
            <Menu/>
            <div className={styles.container}>
                <h1 className={styles.title}>Parties</h1>
                <button className={styles.button} onClick={handleHost}>Héberger</button>
                <button className={styles.button} onClick={handleJoin}>Rejoindre</button>
            </div> 
        </>


    )
}

export default OnlineLocalHostJoin;