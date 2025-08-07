import { useState } from "react";
import styles from "../styles/createRound.module.css";
import { useRouter } from "next/router";

function CreateRound() {
  const router = useRouter();

  const [song, setSong] = useState("");
  const [selectList, setSelectList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [themeName, setThemeName] = useState("");
  const [roundKey, setRoundKey] = useState("");

  const [song1Title, setSong1Title] = useState("");
  const [song1Artist, setSong1Artist] = useState("");
  const [song2Title, setSong2Title] = useState("");
  const [song2Artist, setSong2Artist] = useState("");
  const [song3Title, setSong3Title] = useState("");
  const [song3Artist, setSong3Artist] = useState("");
  const [song4Title, setSong4Title] = useState("");
  const [song4Artist, setSong4Artist] = useState("");
  const [song5Title, setSong5Title] = useState("");
  const [song5Artist, setSong5Artist] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSongInput1, setCurrentSongInput1] = useState("");
  const [currentSongInput2, setCurrentSongInput2] = useState("");
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);

  const backendUrl = "http://localhost:3000";

    // ------------------------------ Selectionne la modal a ouvrir ------------------------------
  const openModal = (index) => {
    setSelectedSongIndex(index);
    let title = "";
    let artist = "";

    
    if (index === 1) {
      title = song1Title;
      artist = song1Artist;
    } else if (index === 2) {
      title = song2Title;
      artist = song2Artist;
    } else if (index === 3) {
      title = song3Title;
      artist = song3Artist;
    } else if (index === 4) {
      title = song4Title;
      artist = song4Artist;
    } else if (index === 5) {
      title = song5Title;
      artist = song5Artist;
    }

    setCurrentSongInput1(title);
    setCurrentSongInput2(artist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSongInput1("");
    setCurrentSongInput2("");
    setSelectedSongIndex(null);
  };


  // ------------------------------ Sauvegarde le title dans un useState------------------------------
  const handleModalSave = () => {
    
    if (selectedSongIndex === 1) {
      setSong1Title(currentSongInput1);
      setSong1Artist(currentSongInput2);
    } else if (selectedSongIndex === 2) {
      setSong2Title(currentSongInput1);
      setSong2Artist(currentSongInput2);
    } else if (selectedSongIndex === 3) {
      setSong3Title(currentSongInput1);
      setSong3Artist(currentSongInput2);
    } else if (selectedSongIndex === 4) {
      setSong4Title(currentSongInput1);
      setSong4Artist(currentSongInput2);
    } else if (selectedSongIndex === 5) {
      setSong5Title(currentSongInput1);
      setSong5Artist(currentSongInput2);
    }
    closeModal();
  };


  // ------------------------------ Envoi ver BDD (manches) ------------------------------
  const handleCreateRound = (e) => {
    e.preventDefault();

    const roundData = {
      themeName: themeName,
      key: roundKey,
      titre1: song1Title,
      artiste1: song1Artist,
      titre2: song2Title,
      artiste2: song2Artist,
      titre3: song3Title,
      artiste3: song3Artist,
      titre4: song4Title,
      artiste4: song4Artist,
      titre5: song5Title,
      artiste5: song5Artist,
    };

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
        setThemeName("");
        setRoundKey("");
        setSong1Title(""); setSong1Artist("");
        setSong2Title(""); setSong2Artist("");
        setSong3Title(""); setSong3Artist("");
        setSong4Title(""); setSong4Artist("");
        setSong5Title(""); setSong5Artist("");
        router.push("/lobbypage");
      })
      .catch((error) => {
        console.error("Échec de la création de la manche :", error);
      });
  };
  
  // ------------------------------ Recupere le titre et artiste ------------------------------
  const getSongButtonText = (title, artist, defaultText) => {
    if (title && artist) {
      return `${title} - ${artist}`;
    } else if (title) {
      return title;
    }
    return defaultText;
  };
  // ------------------------------ fetch demande API ------------------------------
  console.log(song)
      function searchsong(search) {
        console.log('dans fonction')
        fetch(`http://localhost:3000/manches/searchsong`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const list = Array.isArray(data.data) ? data.data : [];
            setSelectList(list);
        })
        .catch(error => console.error("Erreur :", error));
      }


  // ------------------------------ View ------------------------------
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.manche}>CRÉATION DE MANCHE</h1>
        <form onSubmit={handleCreateRound} className={styles.round_container}>
          <div className={styles.input_container}>
            <p className={styles.container_p}>Nom du thème</p>
            <input
              type="text"
              className={styles.input}
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              required
            />
            <p className={styles.container_p}>Key</p>
            <input
              type="text"
              className={styles.input}
              value={roundKey}
              onChange={(e) => setRoundKey(e.target.value)}
              required
            />
          </div>
          <div className={styles.title_container}>
            <button type="button" className={styles.title_button} onClick={() => openModal(1)}>
              {getSongButtonText(song1Title, song1Artist, "Chanson 1")}
            </button>
            <button type="button" className={styles.title_button} onClick={() => openModal(2)}>
              {getSongButtonText(song2Title, song2Artist, "Chanson 2")}
            </button>
            <button type="button" className={styles.title_button} onClick={() => openModal(3)}>
              {getSongButtonText(song3Title, song3Artist, "Chanson 3")}
            </button>
            <button type="button" className={styles.title_button} onClick={() => openModal(4)}>
              {getSongButtonText(song4Title, song4Artist, "Chanson 4")}
            </button>
            <button type="button" className={styles.title_button} onClick={() => openModal(5)}>
              {getSongButtonText(song5Title, song5Artist, "Chanson 5")}
            </button>
          </div>
          <div className={styles.button_place}>
            <button type="submit" className={styles.button}>
              VALIDER
            </button>
          </div>
        </form>
      </div>


      {/* ------------------------------------------ Modal ------------------------------------------ */}
      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <h2 className={styles.modal_title}>Selectionnez votre chanson {selectedSongIndex}</h2>
            <div>
              {/* <label htmlFor="input1" className={styles.modal_label}>Titre:</label>
              <input
                type="text"
                id="input1"
                className={styles.modal_input}
                value={currentSongInput1}
                onChange={(e) => setCurrentSongInput1(e.target.value)}
              /> */}

              <label htmlFor="input1" className={styles.modal_label}>Titre ou artiste:</label>
              <input
                  type="text"
                  className={styles.input}
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  placeholder="Titre ou artiste"
                  required
              />
              <button onClick={()=>searchsong(song)}>Chercher</button>
            </div>

            <div className={styles.modal_buttons_wrapper}>
              <button type="button" className={styles.modal_cancel_button} onClick={closeModal}>
                Annuler
              </button>
              <button type="button" className={styles.modal_save_button} onClick={handleModalSave}>
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------ Fin Modal ------------------------------------------ */}
    </>
  );
}

export default CreateRound;
