import { useState } from "react";
import styles from "../styles/login.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/users';
import SEO from '../components/SEO'



const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state)=>state.user.value);
  if (user.token) {
    router.push('/home');
  }


  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [signupError,setSignupError]=useState('')

  const backendUrl = `${process.env.Backend}/users`;

  const openLoginModal = () => setIsLoginModalOpen(true);
  const openSignupModal = () => setIsSignupModalOpen(true);

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const handleLogin = (e) => {
    e.preventDefault();



    fetch(`${backendUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur de connexion");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(login({ 
          token: data.data.token, 
          username: data.data.username,
          email: data.data.email,
          itemJambes: data.data.itemJambes,
          itemPieds: data.data.itemPieds,
          itemTete: data.data.itemTete,
          itemTorse: data.data.itemTorse,
          keyPoint: data.data.keyPoint,
          nbVictoire: data.data.nbVictoire,
          isAdmin: data.data.isAdmin,
        }));
        router.push("/home")
      })
      .catch((error) => {
        console.error("Échec de la connexion :", error);
        setLoginError('Email ou mot de passe invalide');
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    fetch(`${backendUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur d'inscription");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.error)
        if (data.result === false) {
          setSignupError(data.error);
          return;
        }
        console.log("Inscription réussie !");
        dispatch(login({ 
          token: data.data.token, 
          username: data.data.username,
          email: data.data.email,
          itemJambes: data.data.itemJambes,
          itemPieds: data.data.itemPieds,
          itemTete: data.data.itemTete,
          itemTorse: data.data.itemTorse,
          keyPoint: data.data.keyPoint,
          nbVictoire: data.data.nbVictoire,
          isAdmin: data.data.isAdmin,
        }));
        router.push("/home")
      })
      .catch((error) => {
        console.error("Échec de l'inscription :", error);
      });
  };
    
    const handleInvit = (e) => {
      router.push("/userprofilepage")
    }

  return (
    <>
      <SEO title="Connection | Guess The Key" description="Connectez vous pour obtenir plus de contenue Guess The Key." />



      <main className={styles.container}>

      <h1 className={styles.title}>Guess The Key</h1>     

        <button onClick={openLoginModal} className={styles.button}>
          SE CONNECTER
        </button>
        <button onClick={openSignupModal} className={styles.button}>
          S'INSCRIRE
        </button>
        <button onClick={handleInvit} className={styles.button}>INVITÉ</button>

        {isLoginModalOpen && (
          <div onClick={closeLoginModal} className={styles.modalOverlay}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.modalContainer}
            >
              {loginError && (
                <div style={{ color: "red", margin: "10px", backgroundColor:'white', borderRadius:'10px', padding:'5px',display:"flex",justifyContent:"center", fontWeight:'bolder'}}>
                  {loginError}
                </div>
              )}

              <button
                onClick={closeLoginModal}
                className={styles.modalCloseButton}
              >
                &times;
              </button>
              <form onSubmit={handleLogin} className={styles.modalContent}>
                <p>Email</p>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <p>Mot de passe</p>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button type="submit" className={styles.modalButton}>
                  SE CONNECTER
                </button>
              </form>
            </div>
          </div>
        )}

        {isSignupModalOpen && (
          <div onClick={closeSignupModal} className={styles.modalOverlay}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.modalContainer}
            >
              <button
                onClick={closeSignupModal}
                className={styles.modalCloseButton}
              >
                &times;
              </button>

              {signupError && (
                <div style={{ color: "red", margin: "10px", backgroundColor:'white', borderRadius:'10px', padding:'5px',display:"flex",justifyContent:"center", fontWeight:'bolder'}}>
                  {signupError}
                </div>
              )}

              <form onSubmit={handleSignup} className={styles.modalContent}>
                <p>Nom d'utilisateur</p>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
                <p>Email</p>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <p>Mot de passe</p>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <button type="submit" className={styles.modalButton}>
                  S'INSCRIRE
                </button>
              </form>
            </div>
          </div>
        )}
      </main>    
    </>

  );
};

export default Login;
