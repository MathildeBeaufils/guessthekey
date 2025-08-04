import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';


  const handleSubmit = (page) => {
    if(page === 'solo'){
      // vers page solo
      // router.push('/')
    }else if(page === 'multi'){
      // vers page multi
      // router.push('/');
    }else{
      // vers page parties privées
      // router.push('/');      
    }
  };

function Home() {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Guess The Key</h1>

        <button className={styles.btn} onClick={() => handleSubmit('solo')}>Mode Solo</button>
        <button className={styles.btn} onClick={() => handleSubmit('multi')}>Multijoueurs</button>
        <button className={styles.btn} onClick={() => handleSubmit('pp')}>Parties Privées</button>
      </main>
    </div>
  );
}

export default Home;
