// src/ErrorBoundary.jsx
import React from "react";
import log from "../logger"; // Your custom logger
import "./ErrorBoundary.css";
import CommonError from "./CommonError";
import error from "../../assets/fallback-error.svg";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    log.error("Error caught in Error Boundary:", error.message);
    log.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div>
          <div
            className="common-error-container"
            style={{ marginTop: "100px" }}
          >
            <div className="common-error-body">
              <img src={error} alt="error" />
              <p>{"Something went wrong!"}</p>
              <div className="bottom-container">
                <button onClick={() => window.location.reload()}>Reload</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
