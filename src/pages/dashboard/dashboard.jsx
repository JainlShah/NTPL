import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const moveToCoilInventory = () => {
    navigate("/coil-inventory");
  };

  const moveToRollInventory = () => {
    navigate("/roll-inventory");
  };

  const moveToScrap = () => {
    navigate("/scrap");
  };
  const moveToJobOrderList = () => {
    navigate("/jobOrderList");
  };

  const moveToShortList = () => {
    navigate("/shortlist");
  };
  const moveToPlannedSlitting = () => {
    navigate("/planned-slitting");
  };

  return (
    <div className="dashboard">
      <div className="card card1" onClick={moveToCoilInventory}>
        Coils Inventory
      </div>
      <div className="card card6" onClick={moveToJobOrderList}>
        Job Number
      </div>
      <div className="card card2" onClick={moveToRollInventory}>
        Rolls Inventory
      </div>
      <div className="card card3" onClick={moveToScrap}>
        Scrap
      </div>
      <div className="card card4" onClick={moveToPlannedSlitting}>
        Planned Slitting
      </div>
      <div className="card card5" onClick={moveToShortList}>
        Shortlist
      </div>
    </div>
  );
}

export default Dashboard;
