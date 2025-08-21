import styles from '../styles/gameSolo.module.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoints } from '../reducers/missionCampagne';
import ResultatSolo from './ResultatSolo'
import { useRouter } from 'next/router';
import Menu from './Menu';


function GameSolo() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);


    const router = useRouter();
    // Verifi que seul les user authentifier puisse acceder a la page
    useEffect(() => {
        if (!user.token) {
        router.push('/');
        }
    }, [user]);

    const trackId = useSelector((state) => state.missionCampagne.value.trackId);
    const [keyValide, setKeyValide] = useState('');
    const [theme, setTheme] = useState('');
    const [chanson1, setChanson1] = useState('');
    const [artiste1, setArtiste1] = useState('');
    const [chanson2, setChanson2] = useState('');
    const [artiste2, setArtiste2] = useState('');
    const [chanson3, setChanson3] = useState('');
    const [artiste3, setArtiste3] = useState('');
    const [chanson4, setChanson4] = useState('');
    const [artiste4, setArtiste4] = useState('');
    const [chanson5, setChanson5] = useState('');
    const [artiste5, setArtiste5] = useState('');

    const [tracks, setTracks]= useState([])
    const [key, setKey]= useState('')
    const [point, setPoint] = useState(0);



useEffect(() => {
    if (!trackId) return;

    fetch(`${process.env.Backend}/manches/roundID`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: trackId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setKeyValide(data.key);
        setTheme(data.theme);
        setTracks(data.tracks);
    });
}, [trackId]);


useEffect(() => {
    console.log('Mise à jour key:', key);
    console.log('Mise à jour theme:', theme);
    console.log('Mise à jour tracks:', tracks);
    console.log('Mise à jour tracks0:', tracks[0])
}, [key, theme, tracks]);



    // 1
    function validerChanson1() {
        if (chanson1.trim().toLowerCase() === tracks[0].title.toLowerCase()) {
        setPoint(point + 10)
        dispatch(addPoints({points:10}))
        console.log(' Chanson1 ok');
        } else {
        console.log('Chanson1 pasOK');
        }
    }

    function validerArtiste1() {
        if (artiste1.trim().toLowerCase() === tracks[0].artist.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Artiste1 ok');
        } else {
            console.log('Artiste1 pasOK');
        }
    }

    // 2 
    function validerChanson2() {
        if (chanson2.trim().toLowerCase() === tracks[1].title.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Chanson2 ok');
        } else {
            console.log('Chanson2 pasOK');
        }
    }

    function validerArtiste2() {
        if (artiste2.trim().toLowerCase() === tracks[1].artist.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Artiste2 ok');
        } else {
            console.log('Artiste2 pasOK');
        }
    }

    // 3
    function validerChanson3() {
        if (chanson3.trim().toLowerCase() === tracks[2].title.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Chanson3 ok');
        } else {
            console.log('Chanson3 pasOK');
        }
    }

    function validerArtiste3() {
        if (artiste3.trim().toLowerCase() === tracks[2].artist.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Artiste3 ok');
        } else {
            console.log('Artiste3 pasOK');
        }
    }

    // 4
    function validerChanson4() {
        if (chanson4.trim().toLowerCase() === tracks[3].title.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Chanson4 ok');
        } else {
            console.log('Chanson4 pasOK');
        }
    }

    function validerArtiste4() {
        if (artiste4.trim().toLowerCase() === tracks[3].artist.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Artiste4 ok');
        } else {
            console.log('Artiste4 pasOK');
        }
    }

    // 5
    function validerChanson5() {
        if (chanson5.trim().toLowerCase() === tracks[4].title.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Chanson5 ok');
        } else {
            console.log('Chanson5 pasOK');
        }
    }

    function validerArtiste5() {
        if (artiste5.trim().toLowerCase() === tracks[4].artist.toLowerCase()) {
            setPoint(point + 10)
            dispatch(addPoints({points:10}))
            console.log('Artiste5 ok');
        } else {
            console.log('Artiste5 pasOK');
        }
    }
    

    // Key
    function validerKey() {
        if (key.trim().toLowerCase() === keyValide.toLowerCase()) {
            setPoint(point + 50)
            dispatch(addPoints({points:50}))
            console.log('key ok');
        } else {
            console.log('key pasOK');
        }
    }


    // Liste des composants 
    function Composant1() {
    return (
        <div  className={styles.inputContainer}>
            <div>
                {tracks[0] && (
                <>
                    <audio controls autoPlay >
                        <source src={tracks[0].trackID} type="audio/mp3" />
                        Votre navigateur ne supporte pas l'audio.
                    </audio>
                    <br />
                </>
            )}
            </div>
            <div >
                <label>
                    Trouve la chanson<br />
                    <input
                    type="text"
                    value={chanson1}
                    onChange={(e) => setChanson1(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button className={styles.btn} onClick={validerChanson1}>Valider</button><br />

                <label>
                    Trouve l'artiste<br />
                    <input
                    type="text"
                    value={artiste1}
                    onChange={(e) => setArtiste1(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button className={styles.btn} onClick={validerArtiste1}>Valider</button>
            </div>  
        </div>
    )

        
    }

    function Composant2() {
        return (
            <div  className={styles.inputContainer}>
                <div>
                    {tracks[1] && (
                    <>
                        <audio controls autoPlay>
                            <source src={tracks[1].trackID} type="audio/mp3" />
                            Votre navigateur ne supporte pas l'audio.
                        </audio>
                        <br />
                    </>
                )}
                </div>
                <div>
                    <label>
                        Trouve la chanson<br />
                        <input
                        type="text"
                        value={chanson2}
                        onChange={(e) => setChanson2(e.target.value)}
                        className={styles.input}
                        required
                        />
                    </label>
                    <button  className={styles.btn} onClick={validerChanson2}>Valider</button><br />

                    <label>
                        Trouve l'artiste<br />
                        <input
                        type="text"
                        value={artiste2}
                        onChange={(e) => setArtiste2(e.target.value)}
                        className={styles.input}
                        required
                        />
                    </label>
                    <button  className={styles.btn} onClick={validerArtiste2}>Valider</button>
                </div>  
            </div>          
        )
    }

function Composant3() {
    return (
        <div  className={styles.inputContainer}>
            <div>
                {tracks[2] && (
                <>
                    <audio controls autoPlay>
                        <source src={tracks[2].trackID} type="audio/mp3" />
                        Votre navigateur ne supporte pas l'audio.
                    </audio>
                    <br />
                </>
                )}
            </div>
            <div>
                <label>
                    Trouve la chanson<br />
                    <input
                    type="text"
                    value={chanson3}
                    onChange={(e) => setChanson3(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerChanson3}>Valider</button><br />

                <label>
                    Trouve l'artiste<br />
                    <input
                    type="text"
                    value={artiste3}
                    onChange={(e) => setArtiste3(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerArtiste3}>Valider</button>                
            </div>
        </div>        
    )

}

function Composant4() {
    return (
        <div className={styles.inputContainer}>
            <div>
                {tracks[3] && (
                <>
                    <audio controls autoPlay>
                        <source src={tracks[3].trackID} type="audio/mp3" />
                        Votre navigateur ne supporte pas l'audio.
                    </audio>
                    <br />
                </>
                )}
            </div>
            <div>
                <label>
                    Trouve la chanson<br />
                    <input
                    type="text"
                    value={chanson4}
                    onChange={(e) => setChanson4(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerChanson4}>Valider</button><br />

                <label>
                    Trouve l'artiste<br />
                    <input
                    type="text"
                    value={artiste4}
                    onChange={(e) => setArtiste4(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerArtiste4}>Valider</button>                
            </div>
        </div>        
    )            

}

function Composant5() {
    return (
        <div  className={styles.inputContainer}>
            <div>
                {tracks[4] && (
                <>
                    <audio controls autoPlay>
                        <source src={tracks[4].trackID} type="audio/mp3" />
                        Votre navigateur ne supporte pas l'audio.
                    </audio>
                    <br />
                </>
                )}
            </div>
            <div>
                <label>
                    Trouve la chanson<br />
                    <input
                    type="text"
                    value={chanson5}
                    onChange={(e) => setChanson5(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerChanson5}>Valider</button><br />

                <label>
                    Trouve l'artiste<br />
                    <input
                    type="text"
                    value={artiste5}
                    onChange={(e) => setArtiste5(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerArtiste5}>Valider</button>                
            </div>
        </div>        
    )
}

function Composant6() {
    return (
        <div  className={styles.inputContainer}>
            <div>
                <label>
                    Trouve la key<br />
                    <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className={styles.input}
                    required
                    />
                </label>
                <button  className={styles.btn} onClick={validerKey}>Valider</button><br />                
            </div>
        </div>
    )
}


function Composant7() {
    return <ResultatSolo/> 
}

const composants = [
    <Composant1 />,
    <Composant2 />,
    <Composant3 />,
    <Composant4 />,
    <Composant5 />,
    <Composant6 />,
    <Composant7 />
];

const [index, setIndex] = useState(0);
useEffect(() => {
    if (index < composants.length - 1) {
        const timer = setTimeout(() => {
            setIndex(prev => prev + 1);
        }, 30000); // 30 secondes

        return () => clearTimeout(timer);
    }
}, [index]);

    return (
        <>
            <Menu />
            <main className={styles.main}>


            {index !== 6 && (
                <>
                    <p className={styles.points}>{point} Points</p>
                    <p className={styles.mancheNb}>Manche {index + 1}/6</p>
                    <img className={styles.vynil} src="/source.gif" />      
                </>
            )}
            {composants[index]}

        </main>        
        </>

    );
}

export default GameSolo;
