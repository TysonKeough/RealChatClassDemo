import { io } from 'socket.io-client';

const local_DEV = "http://localhost:8080";

  


console.log("separate websocket ts is here.....");
const socket = io(local_DEV);

// client-side
socket.on("connection", () => {
    console.log(socket.id); 
  });
