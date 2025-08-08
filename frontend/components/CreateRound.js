import { useState } from "react";
import styles from "../styles/createRound.module.css";
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';

function CreateRound() {
    const router = useRouter();
    const user = 'bbb' // useSelector((state)=>state.user.value.username);
    // decommenté le router
    // refactoriser

    const backendUrl = "http://localhost:3000";


    const handleCreateRound = () => {
        const roundData = {selectedItem };

        fetch(`${backendUrl}/manches`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(roundData),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error("Erreur lors de la création de la manche");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Manche créée avec succès !", data);
            setTheme('');
            setKey('');  
            setSelectedItem1('');
            setSelectedItem2('');
            setSelectedItem3(''); 
            setSelectedItem4('');
            setSelectedItem5('');
            setSelectedItem([]);

            // router.push("/lobbypage");
        })
        .catch((error) => {
            console.error("Échec de la création de la manche :", error);
        });
    };

    // mon code:
    const [song1, setSong1] = useState("");
    const [selectList1, setSelectList1] = useState([]);
    const [song2, setSong2] = useState("");
    const [selectList2, setSelectList2] = useState([]);
    const [song3, setSong3] = useState("");
    const [selectList3, setSelectList3] = useState([]);
    const [song4, setSong4] = useState("");
    const [selectList4, setSelectList4] = useState([]);
    const [song5, setSong5] = useState("");
    const [selectList5, setSelectList5] = useState([]);

    const [theme, setTheme] = useState('');
    const [key, setKey] = useState('');  

    const [selectedItem1, setSelectedItem1] = useState('');
    const [selectedItem2, setSelectedItem2] = useState('');
    const [selectedItem3, setSelectedItem3] = useState(''); 
    const [selectedItem4, setSelectedItem4] = useState('');
    const [selectedItem5, setSelectedItem5] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);

    function searchsong1(search) {
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
            setSelectList1(list);
        })
        .catch(error => console.error("Erreur :", error));
    }
    function searchsong2(search) {
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
          setSelectList2(list);
      })
      .catch(error => console.error("Erreur :", error));
    }
    function searchsong3(search) {
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
          setSelectList3(list);
      })
      .catch(error => console.error("Erreur :", error));
    }
    function searchsong4(search) {
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
          setSelectList4(list);
      })
      .catch(error => console.error("Erreur :", error));
    }
    function searchsong5(search) {
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
          setSelectList5(list);
      })
      .catch(error => console.error("Erreur :", error));
    }


    function trackValidate() {
      const items = [{username:user}, {theme:theme}, {key:key}, {titre : [selectedItem1,selectedItem2,selectedItem3,selectedItem4,selectedItem5]}]
        setSelectedItem(items)
      console.log("Sélectionné :", selectedItem);
      handleCreateRound()
    }


    return (
        <>
        <div className={styles.container}>
            <h1 className={styles.manche}>CRÉATION DE MANCHE</h1>
            <div className={styles.round_container}>
            <div className={styles.input_container}>
                <p className={styles.container_p}>Nom du thème</p>
                <input
                  type="text"
                  className={styles.input}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  required
                />
                <p className={styles.container_p}>Key</p>
                <input
                  type="text"
                  className={styles.input}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
            </div>
            <div className={styles.title_container}>
              <div className={styles.title}>
                <div>
                    <label>
                      Recherche un artiste ou une musique:<br></br>
                    <input
                      type="text"
                      className={styles.inputrecherche}
                      value={song1}
                      onChange={(e) => setSong1(e.target.value)}
                      placeholder="Rechercher une chanson"
                      required
                    />
                    </label>
                    <button onClick={() => searchsong1(song1)} className={styles.recherche} >Recherche</button>                  
                </div>
                <div className={styles.radioGroup}>
                    {selectList1.map((item, i) => (
                    <label key={i} className={styles.radioLabel}>
                    <input
                    type="radio"
                    name="song"
                    value={`${item.title} - ${item.artist}`}
                    onChange={() => setSelectedItem1(item)}
                    />
                    {item.title} - {item.artist}
                    </label>
                    ))}
                </div>                
              </div>

              <div className={styles.title}>
                <div>
                    <label>
                      Recherche un artiste ou une musique:<br></br>
                    <input
                      type="text"
                      className={styles.inputrecherche}
                      value={song2}
                      onChange={(e) => setSong2(e.target.value)}
                      placeholder="Rechercher une chanson"
                      required
                    />
                    </label>
                    <button onClick={() => searchsong2(song2)} className={styles.recherche}>Chercher</button>                
                  </div>
                  <div className={styles.radioGroup}>
                    {selectList2.map((item2, i) => (
                    <label key={i} className={styles.radioLabel}>
                        <input
                        type="radio"
                        name="song2"
                        value={`${item2.title} - ${item2.artist}`}
                        onChange={() => setSelectedItem2(item2)}
                        />
                        {item2.title} - {item2.artist}
                    </label>
                    ))}
                </div>            
              </div>

              <div className={styles.title}>
                <div>
                  <label>
                      Recherche un artiste ou une musique:<br></br>
                  <input
                    type="text"
                    className={styles.inputrecherche}
                    value={song3}
                    onChange={(e) => setSong3(e.target.value)}
                    placeholder="Rechercher une chanson"
                    required
                  />
                  </label>
                  <button onClick={() => searchsong3(song3)} className={styles.recherche}>Chercher</button>
                </div>
                <div className={styles.radioGroup}>
                    {selectList3.map((item3, i) => (
                    <label key={i} className={styles.radioLabel}>
                        <input
                        type="radio"
                        name="song3"
                        value={`${item3.title} - ${item3.artist}`}
                        onChange={() => setSelectedItem3(item3)}
                        />
                        {item3.title} - {item3.artist}
                    </label>
                    ))}
                </div>
              </div>

              <div className={styles.title}>
                <div>
                  <label>
                    Recherche un artiste ou une musique:<br></br>
                    <input
                      type="text"
                      className={styles.inputrecherche}
                      value={song4}
                      onChange={(e) => setSong4(e.target.value)}
                      placeholder="Rechercher une chanson"
                      required
                    />
                  </label>
                  <button onClick={() => searchsong4(song4)} className={styles.recherche}>Chercher</button>
                </div>
                <div className={styles.radioGroup}>
                    {selectList4.map((item, i) => (
                    <label key={i} className={styles.radioLabel}>
                        <input
                        type="radio"
                        name="song4"
                        value={`${item.title} - ${item.artist}`}
                        onChange={() => setSelectedItem4(item)}
                        />
                        {item.title} - {item.artist}
                    </label>
                    ))}
                </div>
              </div>

              <div className={styles.title}>
                <div>
                  <label>
                    Recherche un artiste ou une musique:<br></br>
                    <input
                      type="text"
                      className={styles.inputrecherche}
                      value={song5}
                      onChange={(e) => setSong5(e.target.value)}
                      placeholder="Rechercher une chanson"
                      required
                    />
                  </label>
                  <button onClick={() => searchsong5(song5)} className={styles.recherche}>Chercher</button>
                </div>
              <div className={styles.radioGroup}>
                  {selectList5.map((item, i) => (
                  <label key={i} className={styles.radioLabel}>
                      <input
                      type="radio"
                      name="song5"
                      value={`${item.title} - ${item.artist}`}
                      onChange={() => setSelectedItem5(item)}
                      />
                      {item.title} - {item.artist}
                  </label>
                  ))}
              </div>
            </div>

              <button onClick={() => trackValidate()} className={styles.valider} >Valider</button>
            </div>
            <div className={styles.button_place}>
            </div>
            </div>
        </div>
        </>
    );
}

export default CreateRound;