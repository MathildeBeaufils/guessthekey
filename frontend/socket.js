import { io } from "socket.io-client";

const socket = io("https://guessthekey.onrender.com", {
  transports: ["websocket"],
  withCredentials: true
});

socket.on("connect", () => {
  console.log("✅ Connecté au backend via Socket.IO");
  console.log("Transport utilisé :", socket.io.engine.transport.name);
});

export default socket;
