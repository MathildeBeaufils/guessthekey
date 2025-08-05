import styles from "../styles/Online.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import Menu from './Menu';

function Online() {
  return (
    <>
      <Menu/>
      <div className={styles.container}>
        <h1 className={styles.create}>En ligne</h1>
        <p className={styles.game_search}>Recherche de parties</p>
        <div className={styles.game_container}>
          {/* insérer un .map ici quand la création de manche sera faite */}
          <div className={styles.game_user}>
            <p>Username</p>
            <p>Catégorie</p>
            <p>1/8</p>
            <button className={styles.button_join}> Join</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Online;
