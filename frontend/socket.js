import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io("https://guessthekey.vercel.app");

export default socket;
