import "./controls.css";
import { Search, Filter, Calendar, FileDown } from "lucide-react";

const ThroughputControls = () => {
  return (
    <div className="throughput-controls">
      <div className="searchbar-wrapper">
        <Search className="search-icon" />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="controls-group">
        <div className="date-selector">
          <Calendar className="date-icon" />
          <input type="text" readOnly placeholder="Select Date" />
        </div>
        <button className="control-btn filter-btn">
          <Filter size={16} /> Filters
        </button>
        <button className="control-btn export-btn">
          <FileDown size={16} /> Export
        </button>
      </div>
    </div>
  );
};

export default ThroughputControls;
