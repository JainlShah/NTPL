import { useState } from "react";
import JobReport from "./jobReport";
import "./tab.css";
import ThroughputYieldPage from "./throughputAndYield";

const ReportDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobReport");

  return (
    <div className="data-viewer-container">
      <div className="data-viewer-wrapper">
        {/* Combined Radio Button + Tab Name */}
        <div className="radio-tab-container">
          <label
            className={`radio-tab-button ${
              activeTab === "jobReport" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="reportView"
              value="jobReport"
              checked={activeTab === "jobReport"}
              onChange={() => setActiveTab("jobReport")}
              className="radio-input"
            />
            <span className="radio-tab-content">
              <span className="radio-dot"></span>
              <span>Job Report</span>
            </span>
          </label>

          <label
            className={`radio-tab-button ${
              activeTab === "throughputYield" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="reportView"
              value="throughputYield"
              checked={activeTab === "throughputYield"}
              onChange={() => setActiveTab("throughputYield")}
              className="radio-input"
            />
            <span className="radio-tab-content">
              <span className="radio-dot"></span>
              <span>Throughput + Yield</span>
            </span>
          </label>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === "jobReport" && <JobReport />}
          {activeTab === "throughputYield" && <ThroughputYieldPage />}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
