import "./summary.css";

const SummaryCard = ({ totalWeight, totalScrap }) => {
  return (
    <div className="summary-cards">
      <div className="summary-card blue">
        <p>Total Weight</p>
        <h3>{totalWeight} kg</h3>
      </div>
      <div className="summary-card orange">
        <p>Total Scrap</p>
        <h3>{totalScrap} kg</h3>
      </div>
    </div>
  );
};

export default SummaryCard;
