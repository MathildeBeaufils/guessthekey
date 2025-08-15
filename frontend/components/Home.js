import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Menu from "./Menu";
import { useState, useEffect } from "react";
import Image from "next/Image";
import Link from "next/link";
import { useSelector } from 'react-redux';
import SEO from '../components/SEO'

// A faire:
// - Responsive

function Home() {
  const user = useSelector((state)=>state.user.value);
  const router = useRouter();
  // Quete, a decommenté et arrangé quand se sera fait ! + decommenté dans le jsx
  const [nbQuete, setNbQuete] = useState(0);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.tableauQuete && data.data.tableauQuete.length >= 1) {
          setNbQuete(data.data.tableauQuete.length);
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
    <>
      <SEO title="Accueil | Guess The Key" description="Page de navigation Guess The Key" />
      <Menu />
      <main className={styles.main}>
        <h1 className={styles.title}>Guess The Key</h1>

          <Link href="/quest">
            <div className={styles.displayQuete}>
              <p className={styles.nbQuate}>{nbQuete}</p>
              <Image
                src="/cleDeSol.png"
                alt="Logo clé de sol"
                width={60}
                height={100}
              />
            </div>
          </Link>
        <div className={styles.btnContainer}>
          <button className={styles.btn} onClick={() => handleSubmit("solo")}>
            Mode Solo
          </button>
          <button className={styles.btn} onClick={() => handleSubmit("multi")}>
            Multijoueurs
          </button>
          <button className={styles.btn} onClick={() => handleSubmit("pp")}>
            Parties Privées
          </button>          
        </div>

      </main>
    </>
  );
}

export default Home;
