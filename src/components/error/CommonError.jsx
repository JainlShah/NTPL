import React from "react";
import errorImg from "../../assets/fallback-error.svg";
import "./CommonError.css";

const CommonError = ({ error }) => {
  return (
    <div className="common-error-container">
      <div className="common-error-body">
        <img src={errorImg} alt="error" />
        <p>{error}</p>
        <div className="bottom-container">
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    </div>
  );
};

export default CommonError;
