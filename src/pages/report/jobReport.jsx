import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import GenericTable from "../../components/genericTable";
import "./jobReport.css";
import JobReportTable from "./jobReportTable";

const JobReport = ({ data, onSearch, onFilter, onExport, onDateChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showFilters, setShowFilters] = useState(false);
  const [basicDetails, setBasicDetails] = useState(null);
  const [processSummary, setProcessSummary] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Placeholder data with multiple rolls per entry
  const placeholderData = {
    jobNumber: "JOB-2025-001",
    drawingNumber: "DWG-A001-REV3",
    customerName: "Steel Industries Ltd.",
    workOrder: "WO-2025-SP-001",
    PONumber: "PO-SI-2025-001",
    totalProcessWeight: 1245.5,
    totalWeight: 1180.3,
    totalPacks: 12,
    packWeight: 98.36,
    rolls: [
      {
        width: 1200,
        thickness: 2.5,
        processWeight: 245.8,
        rollData: [
          {
            rollNumber: "R001",
            netWeight: 120.5,
            coilNumber: "C001",
            cutWeight: 118.2,
            custScrap: 2.3,
          },
          {
            rollNumber: "R002",
            netWeight: 125.3,
            coilNumber: "C002",
            cutWeight: 123.1,
            custScrap: 2.2,
          },
        ],
      },
      {
        width: 1500,
        thickness: 3.0,
        processWeight: 320.4,
        rollData: [
          {
            rollNumber: "R003",
            netWeight: 160.2,
            coilNumber: "C003",
            cutWeight: 157.8,
            custScrap: 2.4,
          },
          {
            rollNumber: "R004",
            netWeight: 160.2,
            coilNumber: "C004",
            cutWeight: 158.5,
            custScrap: 1.7,
          },
        ],
      },
      {
        width: 1000,
        thickness: 2.0,
        processWeight: 180.6,
        rollData: [
          {
            rollNumber: "R005",
            netWeight: 90.3,
            coilNumber: "C005",
            cutWeight: 88.7,
            custScrap: 1.6,
          },
          {
            rollNumber: "R006",
            netWeight: 90.3,
            coilNumber: "C006",
            cutWeight: 89.1,
            custScrap: 1.2,
          },
        ],
      },
      {
        width: 1350,
        thickness: 2.8,
        processWeight: 298.7,
        rollData: [
          {
            rollNumber: "R007",
            netWeight: 149.35,
            coilNumber: "C007",
            cutWeight: 147.2,
            custScrap: 2.15,
          },
          {
            rollNumber: "R008",
            netWeight: 149.35,
            coilNumber: "C008",
            cutWeight: 146.8,
            custScrap: 2.55,
          },
        ],
      },
      {
        width: 800,
        thickness: 1.5,
        processWeight: 120.3,
        rollData: [
          {
            rollNumber: "R009",
            netWeight: 60.15,
            coilNumber: "C009",
            cutWeight: 59.2,
            custScrap: 0.95,
          },
          {
            rollNumber: "R010",
            netWeight: 60.15,
            coilNumber: "C010",
            cutWeight: 58.8,
            custScrap: 1.35,
          },
        ],
      },
      {
        width: 1800,
        thickness: 4.0,
        processWeight: 480.9,
        rollData: [
          {
            rollNumber: "R011",
            netWeight: 240.45,
            coilNumber: "C011",
            cutWeight: 238.1,
            custScrap: 2.35,
          },
          {
            rollNumber: "R012",
            netWeight: 240.45,
            coilNumber: "C012",
            cutWeight: 237.8,
            custScrap: 2.65,
          },
        ],
      },
    ],
  };

  // Define columns for the GenericTable
  const columns = [
    {
      label: "Serial No",
      accessor: "serialNo",
    },
    {
      label: "Width (mm)",
      accessor: "width",
    },
    {
      label: "Thickness (mm)",
      accessor: "thickness",
    },
    {
      label: "Process Weight (kg)",
      accessor: "processWeight",
    },
    {
      label: "Roll Details",
      accessor: "rollDetails",
      render: (value, row) => (
        <div className="data-viewer-roll-details">
          <div>
            <strong>Roll No:</strong>{" "}
            {formatMultipleValues(row.rollData, "rollNumber")}
          </div>
          <div>
            <strong>Net Weight:</strong>{" "}
            {formatMultipleValues(row.rollData, "netWeight")} kg
          </div>
          <div>
            <strong>Coil No:</strong>{" "}
            {formatMultipleValues(row.rollData, "coilNumber")}
          </div>
          {row.rollCount > 1 && (
            <div className="data-viewer-roll-count">
              {row.rollCount} rolls total
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Use placeholder data if no data is provided
    const currentData = data || placeholderData;

    if (currentData) {
      setBasicDetails({
        jobNumber: currentData.jobNumber,
        drawingNumber: currentData.drawingNumber,
        customerName: currentData.customerName,
        workOrder: currentData.workOrder,
        PONumber: currentData.PONumber,
      });

      setProcessSummary({
        totalProcessWeight: currentData.totalProcessWeight,
        totalWeight: currentData.totalWeight,
        totalPacks: currentData.totalPacks,
        packWeight: currentData.packWeight,
      });

      setTableData(
        currentData.rolls.map((roll, index) => ({
          serialNo: index + 1,
          width: roll.width,
          thickness: roll.thickness,
          processWeight: roll.processWeight,
          rollData: roll.rollData,
          rollCount: roll.rollData.length,
          rollDetails: formatMultipleValues(roll.rollData, "rollNumber"),
        }))
      );
    }
  }, [data]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (onDateChange) onDateChange(update);
  };

  const handleExport = () => {
    if (onExport) onExport();
    alert("Exporting data...");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatMultipleValues = (rollData, field) => {
    if (rollData.length === 1) {
      return rollData[0][field];
    }
    return rollData.map((roll) => roll[field]).join(", ");
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    // Add your row click handling logic here
  };

  return (
    <div className="data-viewer-container">
      <div className="data-viewer-wrapper">
        {/* Header */}
        <div className="data-viewer-card">
          <div className="data-viewer-section-title">Search & Actions</div>
          <div className="data-viewer-header-flex">
            {/* Search */}
            <div className="data-viewer-search-container">
              <Search className="data-viewer-search-icon" />
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={handleSearch}
                className="data-viewer-search-input"
              />
            </div>

            {/* Controls: Date + Filter + Export */}
            <div className="data-viewer-controls">
              {/* Date Picker */}
              <div className="data-viewer-date-container">
                <Calendar className="data-viewer-date-icon" />
                <input
                  type="text"
                  placeholder="Select date range"
                  className="data-viewer-date-input"
                  readOnly
                />
              </div>

              {/* Filter Button */}
              <button
                className={`data-viewer-button data-viewer-button-filter ${
                  showFilters ? "active-filter" : ""
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </button>

              {/* Export Button */}
              <button
                className="data-viewer-button data-viewer-button-export"
                onClick={handleExport}
              >
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        {basicDetails && (
          <div className="data-viewer-card">
            <h3 className="data-viewer-section-title">Basic Details</h3>
            <div className="basic-details-grid">
              {/* Row 1 */}
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Job No. <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.jobNumber || "JOB-2025-001"}
                </div>
              </div>
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Drawing No. <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.drawingNumber || "DWG-A001-REV3"}
                </div>
              </div>
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Sets <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.sets || "1"}
                </div>
              </div>

              {/* Row 2 */}
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Work Order <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.workOrder || "WO-2025-SP-001"}
                </div>
              </div>
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  PO No. <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.PONumber || "PO-SI-2025-001"}
                </div>
              </div>
              <div className="basic-details-cell">
                <div className="basic-details-label">Customer Job No.</div>
                <div className="basic-details-value">
                  {basicDetails.customerJobNo || "HFUE45"}
                </div>
              </div>

              {/* Row 3 */}
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Drawing Weight (kg) <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.drawingWeight || "40"}
                </div>
              </div>
              <div className="basic-details-cell">
                <div className="basic-details-label">
                  Customer Name <span style={{ color: "red" }}>*</span>
                </div>
                <div className="basic-details-value">
                  {basicDetails.customerName || "Steel Industries Ltd."}
                </div>
              </div>
              {/* Optional empty cell for layout balance if needed */}
              <div className="basic-details-cell"></div>
            </div>
          </div>
        )}

        {/* Process Summary */}
        {processSummary && (
          <div className="data-viewer-card">
            <h3 className="data-viewer-section-title">Process Summary</h3>
            <div className="data-viewer-summary-grid">
              <div className="data-viewer-summary-card blue">
                <div className="data-viewer-summary-label">Process Weight</div>
                <div className="data-viewer-summary-value blue">
                  {processSummary.totalProcessWeight} kg
                </div>
              </div>
              <div className="data-viewer-summary-card green">
                <div className="data-viewer-summary-label">Total Weight</div>
                <div className="data-viewer-summary-value green">
                  {processSummary.totalWeight} kg
                </div>
              </div>
              <div className="data-viewer-summary-card purple">
                <div className="data-viewer-summary-label">Total Packs</div>
                <div className="data-viewer-summary-value purple">
                  {processSummary.totalPacks}
                </div>
              </div>
              <div className="data-viewer-summary-card orange">
                <div className="data-viewer-summary-label">Pack Weight</div>
                <div className="data-viewer-summary-value orange">
                  {processSummary.packWeight} kg
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="data-viewer-card-content">
          <JobReportTable rolls={placeholderData.rolls} />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="data-viewer-modal-overlay">
            <div className="data-viewer-modal">
              <h4 className="data-viewer-modal-title">Filters</h4>
              <div className="data-viewer-form-group">
                <div className="data-viewer-form-group">
                  <label className="data-viewer-form-label">Status</label>
                  <select className="data-viewer-form-select">
                    <option>All</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className="data-viewer-form-group">
                  <label className="data-viewer-form-label">Weight Range</label>
                  <select className="data-viewer-form-select">
                    <option>All</option>
                    <option>0-100 kg</option>
                    <option>100-200 kg</option>
                    <option>200+ kg</option>
                  </select>
                </div>
              </div>
              <div className="data-viewer-modal-actions">
                <button
                  className="data-viewer-button data-viewer-button-secondary"
                  onClick={() => setShowFilters(false)}
                >
                  Cancel
                </button>
                <button
                  className="data-viewer-button data-viewer-button-primary"
                  onClick={() => {
                    if (onFilter) onFilter();
                    setShowFilters(false);
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobReport;
