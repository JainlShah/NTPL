import { useState } from "react";
import ThroughputControls from "./throughputControls";
import SummaryCard from "./summaryCard";
import CommonYieldTable from "./commonTable";
import "./throughputTab.css";

const tabList = ["Slitting", "Cutting", "Packing"];

const mockData = {
  Slitting: {
    totalWeight: 1523.6,
    totalScrap: 98.4,
    rows: [
      {
        machine: "M1",
        jobs: [
          {
            jobId: "J001",
            widths: [1000, 1200],
            weights: [200, 220],
          },
        ],
        totalWeight: 420,
        scrap: 20,
      },
      {
        machine: "M2",
        jobs: [
          {
            jobId: "J002",
            widths: [800],
            weights: [150],
          },
          {
            jobId: "J003",
            widths: [850],
            weights: [160],
          },
        ],
        totalWeight: 310,
        scrap: 10,
      },
    ],
  },
  Cutting: {
    totalWeight: 1120,
    totalScrap: 50.4,
    rows: [
      {
        machine: "M3",
        jobs: [
          {
            jobId: "J004",
            widths: [500],
            weights: [300],
          },
        ],
        totalWeight: 300,
        scrap: 20,
      },
    ],
  },
  Packing: {
    totalWeight: 840,
    totalScrap: 25.7,
    rows: [
      {
        machine: "M4",
        jobs: [
          {
            jobId: "J005",
            widths: [450],
            weights: [400],
          },
        ],
        totalWeight: 400,
        scrap: 15,
      },
    ],
  },
};

const ThroughputTabs = () => {
  const [activeTab, setActiveTab] = useState("Slitting");

  const currentData = mockData[activeTab];

  return (
    <div className="throughput-tabs-wrapper">
      <div className="tab-header">
        {tabList.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <ThroughputControls />
      <SummaryCard
        totalWeight={currentData.totalWeight}
        totalScrap={currentData.totalScrap}
      />
      <CommonYieldTable rows={currentData.rows} />
    </div>
  );
};

export default ThroughputTabs;
