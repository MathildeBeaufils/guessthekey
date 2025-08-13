import { useState, useEffect } from "react";
import styles from "../styles/createRound.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import socket from '../socket';

const SongSearchInput = ({
  index,
  song,
  onSongChange,
  onSearch,
  selectList,
  onSelect,
  selectedItem,
}) => (
  <div className={styles.title}>
    <div>
      <label>
        Recherche un artiste ou une musique:
        <br />
        <input
          type="text"
          className={styles.inputrecherche}
          value={song}
          onChange={(e) => onSongChange(e.target.value)}
          placeholder="Rechercher une chanson"
          required
        />
      </label>
      <button onClick={onSearch} className={styles.recherche}>
        Recherche
      </button>
    </div>
    <div className={styles.radioGroup}>
      {selectList.map((item, i) => (
        <label key={i} className={styles.radioLabel}>
          <input
            type="radio"
            name={`song-${index}`}
            checked={selectedItem && selectedItem.deezerId === item.deezerId}
            onChange={() => onSelect(item)}
          />
          {item.title} - {item.artist}
        </label>
      ))}
    </div>
  </div>
);

function CreateRound() {
  const router = useRouter();
  const lobbyCode = router.query.lobbyCode;

  // Ne rien faire tant que lobbyCode est undefined
  if (!lobbyCode) return <div>Chargement...</div>;

  const user = useSelector((state) => state.user.value);
  const backendUrl = "http://localhost:3000";

  const [songs, setSongs] = useState(
    Array(5).fill({ search: "", results: [], selected: null })
  );

  const [theme, setTheme] = useState("");
  const [key, setKey] = useState("");
  const [categorieList, setCategorieList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/manches/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategorieList(data.categories);
      })
      .catch((error) => console.error("Erreur lors du chargement des catégories :", error));
  }, []);

  const handleCategorieChange = (id) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = [...prev];
      const index = newSelectedCategories.indexOf(id);

      if (index > -1) {
        newSelectedCategories.splice(index, 1);
      } else {
        newSelectedCategories.push(id);
      }
      return newSelectedCategories;
    });
  };

  const displayCategorie = categorieList.map((data, i) => (
    <label key={i} className={styles['category-label']}>
      {data.nom}
      <input
        type="checkbox"
        id={`cat-${i}`}
        value={data.nom}
        checked={selectedCategories.includes(data._id)}
        onChange={() => handleCategorieChange(data._id)}
      />
    </label>
  ));

  const searchSong = (index) => {
    const search = songs[index].search;
    fetch(`${backendUrl}/manches/searchsong`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search }),
    })
      .then((response) => response.json())
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data : [];
        setSongs((prev) =>
          prev.map((s, i) => (i === index ? { ...s, results: list } : s))
        );
      })
      .catch((error) => console.error("Erreur :", error));
  };

  const handleCreateGame = (items) => {
    fetch(`${backendUrl}/manches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedItem: items }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création de la manche");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Manche créée avec succès !", data);

        // Crée une partie (game) avec un seul tour (la manche créée)
        const gameData = {
          theme: theme,
          key: key,
          tours: [data]
        };
        socket.emit("createGame", { lobbyCode, gameData });
        router.push(`/lobby/${lobbyCode}`);
      })
      .catch((error) => {
        console.error("Échec de la création de la manche :", error);
      });
  };

  const trackValidate = () => {
    if (!user || !user.username) {
      console.error("User is not logged in or username is missing.");
      alert("Veuillez vous connecter pour créer une manche.");
      return;
    }

    const selectedSongs = songs.map((s) => s.selected);
    const items = [
      { username: user.username },
      { theme: theme },
      { key: key },
      { categorie: selectedCategories },
      { titre: selectedSongs},
    ];
  handleCreateGame(items);
  };

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

          <div className={styles['category-container']}>
            {displayCategorie}
          </div>

          <div className={styles.title_container}>
            {songs.map((s, index) => (
              <SongSearchInput
                key={index}
                index={index}
                song={s.search}
                onSongChange={(value) =>
                  setSongs((prev) =>
                    prev.map((song, i) =>
                      i === index ? { ...song, search: value } : song
                    )
                  )
                }
                onSearch={() => searchSong(index)}
                selectList={s.results}
                onSelect={(item) =>
                  setSongs((prev) =>
                    prev.map((song, i) =>
                      i === index
                        ? { ...song, selected: item, search: `${item.title} - ${item.artist}` } // <-- Correction ici
                        : song
                    )
                  )
                }
                selectedItem={s.selected}
              />
            ))}
          </div>

          <div className={styles.button_validate}>
            <button onClick={trackValidate} className={styles.valider}>
              Valider
            </button>
          </div>
        </div>
        <div className={styles.button_place}></div>
      </div>
    </>
  );
}

export default CreateRound;