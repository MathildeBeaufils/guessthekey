import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function Test() {
    const dispatch = useDispatch();

    const trackId = useSelector((state) => state.missionCampagne.value.trackId);
    console.log(trackId)
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

    fetch(`http://localhost:3000/manches/roundID`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: trackId.trackId }),
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
}, [key, theme, tracks]);


    const a = tracks.map((data, i)=>{
        return <p> {data.title} - {data.artist}</p>
    })

    // 1
    function validerChanson1() {
        if (chanson1.trim().toLowerCase() === tracks[0].title.toLowerCase()) {
        setPoint(point + 10)
        console.log(' Chanson1 ok');
        } else {
        console.log('Chanson1 pasOK');
        }
    }

    function validerArtiste1() {
        if (artiste1.trim().toLowerCase() === tracks[0].artist.toLowerCase()) {
            setPoint(point + 10)
            console.log('Artiste1 ok');
        } else {
            console.log('Artiste1 pasOK');
        }
    }

    // 2 
    function validerChanson2() {
        if (chanson2.trim().toLowerCase() === tracks[1].title.toLowerCase()) {
            setPoint(point + 10)
            console.log('Chanson2 ok');
        } else {
            console.log('Chanson2 pasOK');
        }
    }

    function validerArtiste2() {
        if (artiste2.trim().toLowerCase() === tracks[1].artist.toLowerCase()) {
            setPoint(point + 10)
            console.log('Artiste2 ok');
        } else {
            console.log('Artiste2 pasOK');
        }
    }

    // 3
    function validerChanson3() {
        if (chanson3.trim().toLowerCase() === tracks[2].title.toLowerCase()) {
            setPoint(point + 10)
            console.log('Chanson3 ok');
        } else {
            console.log('Chanson3 pasOK');
        }
    }

    function validerArtiste3() {
        if (artiste3.trim().toLowerCase() === tracks[2].artist.toLowerCase()) {
            setPoint(point + 10)
            console.log('Artiste3 ok');
        } else {
            console.log('Artiste3 pasOK');
        }
    }

    // 4
    function validerChanson4() {
        if (chanson4.trim().toLowerCase() === tracks[3].title.toLowerCase()) {
            setPoint(point + 10)
            console.log('Chanson4 ok');
        } else {
            console.log('Chanson4 pasOK');
        }
    }

    function validerArtiste4() {
        if (artiste4.trim().toLowerCase() === tracks[3].artist.toLowerCase()) {
            setPoint(point + 10)
            console.log('Artiste4 ok');
        } else {
            console.log('Artiste4 pasOK');
        }
    }

    // 5
    function validerChanson5() {
        if (chanson5.trim().toLowerCase() === tracks[4].title.toLowerCase()) {
            setPoint(point + 10)
            console.log('Chanson5 ok');
        } else {
            console.log('Chanson5 pasOK');
        }
    }

    function validerArtiste5() {
        if (artiste5.trim().toLowerCase() === tracks[4].artist.toLowerCase()) {
            setPoint(point + 10)
            console.log('Artiste5 ok');
        } else {
            console.log('Artiste5 pasOK');
        }
    }
    

    // Key
    function validerKey() {
        if (key.trim().toLowerCase() === keyValide.toLowerCase()) {
            setPoint(point + 50)
            console.log('key ok');
        } else {
            console.log('key pasOK');
        }
    }

    return (
        <div>
            <p>{point}</p>
            {a}            
            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la chanson<br />
                    <input
                    type="text"
                    value={chanson1}
                    onChange={(e) => setChanson1(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerChanson1}>Valider</button><br />

                <label>
                    Trouve l'artiste<br />
                    <input
                    type="text"
                    value={artiste1}
                    onChange={(e) => setArtiste1(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerArtiste1}>Valider</button>
            </div> 
            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la chanson2<br />
                    <input
                    type="text"
                    value={chanson2}
                    onChange={(e) => setChanson2(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerChanson2}>Valider</button><br />

                <label>
                    Trouve l'artiste2<br />
                    <input
                    type="text"
                    value={artiste2}
                    onChange={(e) => setArtiste2(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerArtiste2}>Valider</button>
            </div>
            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la chanson3<br />
                    <input
                    type="text"
                    value={chanson3}
                    onChange={(e) => setChanson3(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerChanson3}>Valider</button><br />

                <label>
                    Trouve l'artiste3<br />
                    <input
                    type="text"
                    value={artiste3}
                    onChange={(e) => setArtiste3(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerArtiste3}>Valider</button>
            </div>
            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la chanson4<br />
                    <input
                    type="text"
                    value={chanson4}
                    onChange={(e) => setChanson4(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerChanson4}>Valider</button><br />

                <label>
                    Trouve l'artiste4<br />
                    <input
                    type="text"
                    value={artiste4}
                    onChange={(e) => setArtiste4(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerArtiste4}>Valider</button>
            </div>
            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la chanson5<br />
                    <input
                    type="text"
                    value={chanson5}
                    onChange={(e) => setChanson5(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerChanson5}>Valider</button><br />

                <label>
                    Trouve l'artiste5<br />
                    <input
                    type="text"
                    value={artiste5}
                    onChange={(e) => setArtiste5(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerArtiste5}>Valider</button>
            </div>


            <div style={{ marginTop:'50px' , marginLeft:'50px'}}>
                <label>
                    Trouve la key<br />
                    <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                    />
                </label>
                <button onClick={validerKey}>Valider</button><br />
            </div>
        </div>
    );
}

export default Test;
