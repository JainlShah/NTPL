import { useEffect } from "react";
import { io } from "socket.io-client";

function Chat() {
  useEffect(() => {
    // Initialize the socket connection
    const socket = io("http://localhost:8000");

    // Optionally listen to events
    socket.on("connect", () => {
      console.log("Connected to the socket server");
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return <div>Chat</div>;
}

export default Chat;
