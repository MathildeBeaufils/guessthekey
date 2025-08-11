import styles from '../styles/Solo.module.css';
import { useState } from 'react';

function Test() {
    const [song, setSong] = useState("");
    const [selectList, setSelectList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    function searchsong(search) {
        fetch(`http://localhost:3000/manches/searchsong`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
        })
        .then(response => response.json())
        .then(data => {
            const list = Array.isArray(data.data) ? data.data : [];
            setSelectList(list);
        })
        .catch(error => console.error("Erreur :", error));
    }

    function handleRadioChange(item) {
        setSelectedItem(item);
        console.log("Sélectionné :", item);
    }

    function trackValidate(item) {
        console.log("Sélectionné :", selectedItem);
    }
    return (
        <>
        <input
            type="text"
            className={styles.input}
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="Rechercher une chanson"
            required
        />
        <button onClick={() => searchsong(song)}>Chercher</button>

        <div className={styles.radioGroup}>
            {selectList.map((item, i) => (
            <label key={i} className={styles.radioLabel}>
                <input
                type="radio"
                name="song"
                value={`${item.title} - ${item.artist}`}
                onChange={() => handleRadioChange(item)}
                />
                {item.title} - {item.artist}
            </label>
            ))}
        </div>
        <button onClick={() => trackValidate()}>Selectionner</button>
        </>
    );
}

export default Test;
