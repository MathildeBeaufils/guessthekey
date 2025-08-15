import { io } from "socket.io-client";
// port déterminé dans le backend, spécifique pour le Socket
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default socket;
