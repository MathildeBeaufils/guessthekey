import styles from '../styles/localJoinPage.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import socket from '../socket';
import { useState } from 'react';
import SEO from '../components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';
import {  useEffect } from "react";


function LocalJoinPage() {
    const router = useRouter();
    const username = useSelector((state) => state.user.value.username);
    const user = useSelector((state) => state.user.value);
    const [code, setCode] = useState('');

    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

    const handleJoin = () => {
        console.log(username)
        fetch(`https://guessthekey.onrender.com/lobbies/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, username }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    socket.emit('joinLobby', {lobbyId: data.code, username});
                    router.push(`/lobby/${data.code}`);
                } 
            })
    };

    const handleBack = () => {
        router.push("/localHostJoin");
    };

    return (
        <>
            <SEO title="Rejoindre un ami | Guess The Key" description="Entrez le code de votre ami pour le rejoindre." />
            <Menu/>
            <div className={styles.container}>
                <div className={styles.back}>
                    <button className={styles.backBtn} onClick={handleBack}>
                        <FontAwesomeIcon icon={faReply} />
                    </button>
                </div>
                <h1 className={styles.title}>Rejoindre une Partie Locale</h1>
                <div className={styles.inputContainer}>
                    <label className={styles.inputContainer}>Code de la Partie :
                        <input className={styles.input} type="text" placeholder="Entrez le code de la partie" onChange={(e) => setCode(e.target.value)}/>
                    </label>
                </div>
                <button className={styles.btn} onClick={handleJoin}>VALIDER</button>
            </div>        
        </>


    );
}

export default LocalJoinPage;
