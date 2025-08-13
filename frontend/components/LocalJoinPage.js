import styles from '../styles/localJoinPage.module.css';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import socket from '../socket';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply} from '@fortawesome/free-solid-svg-icons';


function LocalJoinPage() {
    const router = useRouter();
    const username = useSelector((state) => state.user.value.username);
    const [code, setCode] = useState('');

    const handleJoin = () => {
        console.log(username)
        fetch('http://localhost:3000/lobbies/join', {
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
            <Menu/>
            <div className={styles.container}>
                <div className={styles.back}>
                    <button className={styles.backBtn} onClick={handleBack}>
                        <FontAwesomeIcon icon={faReply} />
                    </button>
                </div>
                <h1>Rejoindre une Partie Locale</h1>
                <div className={styles.inputContainer}>
                    <label htmlFor="gameCode">Code de la Partie :</label>
                    <input className={styles.input} type="text" placeholder="Entrez le code de la partie" onChange={(e) => setCode(e.target.value)}/>
                </div>
                <button className={styles.btn} onClick={handleJoin}>VALIDER</button>
            </div>        
        </>


    );
}

export default LocalJoinPage;
