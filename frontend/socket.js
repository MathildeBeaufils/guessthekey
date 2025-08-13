import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io("http://localhost:4000");

export default socket;
