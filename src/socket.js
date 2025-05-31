import { io } from "socket.io-client";
const urlProd = "https://jarvis-ai.eu"
const urlDev = "http://127.0.0.1:5000"

const socket = io(urlProd, {
  transports: ["websocket"],
  reconnection: true,            // autoriser la reconnexion
  reconnectionAttempts: 5,       // max 5 tentatives
  timeout: 5000,                 // délai max pour établir une connexion (5 sec)
  autoConnect: true,             // démarrage automatique
});

export default socket;