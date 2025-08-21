import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io("https://guessthekey.onrender.com", {
transports: ["websocket", "polling"], // compatible avec Render
withCredentials: true
});



export default socket;
