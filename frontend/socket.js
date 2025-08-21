import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io("https://guessthekey.onrender.com", {
transports: ["websocket", "polling"], // compatible avec Render
withCredentials: true
});

socket.on("connect", () => {
console.log("✅ Connecté au backend via proxy Vercel");
})

export default socket;
