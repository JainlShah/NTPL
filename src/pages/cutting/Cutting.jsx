import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import "../../styles/cutting.css";

function Cutting() {
  const navigate = useNavigate();

  const moveToAddScrap = () => {
    navigate("/add-scrap");
  };

  const moveToRollReadyCutting = () => {
    navigate("/rolls-ready-cutting");
  };

  return (
    <>
      <h1>Cutting Supervisor</h1>
      <div className="cutting">
        <div className="card" onClick={moveToAddScrap}>
          Add Scrap
        </div>

        <div className="card" onClick={moveToRollReadyCutting}>
          Rolls Ready for Cutting
        </div>
      </div>
    </>
  );
}

export default Cutting;
