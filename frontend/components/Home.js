import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// A faire:
// - mettre les liens sur la page
// - Adapter le fetch

function Home() {
  const router = useRouter();
  // Quete, a decommenté et arrangé quand se sera fait ! + decommenté dans le jsx
  const [nbQuete, setNbQuete] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.quete && data.quete.length >= 1) {
          setNbQuete(data.quete.length);
          setIsVisible(true);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du fetch :", error);
      });
  }, []);

  const Router = useRouter();

  const handleSubmit = (page) => {
    if (page === "solo") {
      // vers page solo
      router.push("/solo");
    } else if (page === "multi") {
      // vers page multi
      Router.push("/onlineHostJoin");
    } else {
      // vers page parties privées
      Router.push("/localHostJoin");
    }
  };
  return (
    <div>
      <Menu />
      <main className={styles.main}>
        <h1 className={styles.title}>Guess The Key</h1>

        {/* {isVisible && ( */}
          <Link href="/quest">
            <div className={styles.displayQuete}>
              {<p className={styles.nbQuate}>{nbQuete}</p>}
              <Image
                src="/cleDeSol.png"
                alt="Logo clé de sol"
                width={70}
                height={100}
              />
            </div>
          </Link>
        {/* )} */}

        <button className={styles.btn} onClick={() => handleSubmit("solo")}>
          Mode Solo
        </button>
        <button className={styles.btn} onClick={() => handleSubmit("multi")}>
          Multijoueurs
        </button>
        <button className={styles.btn} onClick={() => handleSubmit("pp")}>
          Parties Privées
        </button>
      </main>
    </div>
  );
}

export default Home;
