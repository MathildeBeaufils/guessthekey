import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io("https://guessthekey.onrender.com", {
transports: ["websocket", "polling"], // compatible avec Render
withCredentials: true
});

socket.on("connect", () => {
  console.log("✅ Connecté au backend via proxy Vercel");
  console.log("Transport utilisé :", socket.io.engine.transport.name); // --> 'websocket' ou 'polling'
});

export default socket;
