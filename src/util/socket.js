// socket.js
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/apiConfig";

const socket = io(API_BASE_URL, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
