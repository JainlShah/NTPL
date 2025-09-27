import "./App.css";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { SlittingOperatorProvider } from "./context/SlittingOperatorProvider";
import { useEffect } from "react";
import socket from "./util/socket";

function App() {
  useEffect(() => {
    console.log("Connecting to socket...");
    socket.connect();

    // Request locked rows data when the app loads
    socket.emit("requestLockedRows");

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  return (
    <SlittingOperatorProvider>
      <div className="App">
        <ErrorBoundary>
          <Navigation />
          <ToastContainer />
          <Toaster position="top-right" reverseOrder={false} />
        </ErrorBoundary>
      </div>
    </SlittingOperatorProvider>
  );
}
export default App;
