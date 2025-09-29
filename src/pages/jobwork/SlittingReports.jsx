import React, { useState, useEffect } from 'react';
import '../../styles/slittingReports.css';

const SlittingReports = ({ onClose, jobData = null, showAsPopup = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Mock data based on the image
  const mockData = [
    {
      jobNo: 'NTPL/09/25/11951',
      drawingNo: '1000KVA-SOLAR(C-5968)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 1,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025'
    },
    {
      jobNo: 'NTPL/09/25/11948',
      drawingNo: 'ET-3 (C-5967)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 2,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025'
    },
    {
      jobNo: 'NTPL/09/25/11937',
      drawingNo: 'ET-2126K (C-5958)',
      woNo: 'WO/01/08/12366',
      jobNature: 'STAP LAP',
      quality: '30CG120',
      sets: 1,
      density: 7.65,
      gauge: 0.295,
      stackingFactor: 97,
      created: '03-09-2025'
    },
    {
      jobNo: 'NTPL/09/25/11947',
      drawingNo: 'U-55 (C-5966)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27MM',
      sets: 1,
      density: 7.65,
      gauge: 0.265,
      stackingFactor: 97,
      created: '03-09-2025'
    },
    {
      jobNo: 'NTPL/09/25/11946',
      drawingNo: '630-KVA (C-5965)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 4,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025'
    },
    {
      jobNo: 'NTPL/09/25/11945',
      drawingNo: '1250KVA (C-5964)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 3,
      density: 7.65,
      gauge: 0.265,
      stackingFactor: 97,
      created: '03-09-2025'
    }
  ];

  // Mock detailed slitting report data based on the attached image
  const getSlittingReportData = (jobNo) => {
    if (jobNo === 'NTPL/09/25/11937') {
      return {
        header: {
          drawingNo: 'ET-2126K (C-5958)',
          woNo: 'WO/01/08/12366',
          gauge: '0.295',
          quality: '30CG120',
          jobNature: 'STAP LAP',
          employee: 'Danish',
          jobNo: 'NTPL/09/25/11937',
          sets: '1',
          density: '7.65',
          stackingFactor: '97.00%'
        },
        tableData: [
          { no: 1, width: 275, sets: 1, trimmingWeight: 2.85, processWgt: 782.35, lengthInMeter: 1299.5 },
          { no: 2, width: 265, sets: 1, trimmingWeight: 1.42, processWgt: 377.66, lengthInMeter: 649.75 },
          { no: 3, width: 255, sets: 1, trimmingWeight: 0.99, processWgt: 252.36, lengthInMeter: 452 },
          { no: 4, width: 245, sets: 1, trimmingWeight: 0.81, processWgt: 197.6, lengthInMeter: 367.25 },
          { no: 5, width: 225, sets: 1, trimmingWeight: 1.23, processWgt: 278.35, lengthInMeter: 565 },
          { no: 6, width: 205, sets: 1, trimmingWeight: 0.99, processWgt: 202.88, lengthInMeter: 452 },
          { no: 7, width: 185, sets: 1, trimmingWeight: 0.81, processWgt: 149.2, lengthInMeter: 367.25 },
          { no: 8, width: 165, sets: 1, trimmingWeight: 0.69, processWgt: 112.73, lengthInMeter: 310.75 },
          { no: 9, width: 145, sets: 1, trimmingWeight: 0.57, processWgt: 81.07, lengthInMeter: 254.25 },
          { no: 10, width: 115, sets: 1, trimmingWeight: 0.68, processWgt: 78.53, lengthInMeter: 310.75 },
          { no: 11, width: 85, sets: 1, trimmingWeight: 0.44, processWgt: 37.03, lengthInMeter: 197.75 }
        ],
        totals: {
          trimmingWeight: 11.480,
          processWgt: 2549.760,
          lengthInMeter: 5226.250
        }
      };
    }
    
    // Default data for other jobs
    return {
      header: {
        drawingNo: 'Sample Drawing',
        woNo: 'WO/Sample',
        gauge: '0.267',
        quality: 'M4/0.27',
        jobNature: 'OVER LAP',
        employee: 'Danish',
        jobNo: jobNo,
        sets: '1',
        density: '7.65',
        stackingFactor: '97.00%'
      },
      tableData: [
        { no: 1, width: 230, sets: 1, trimmingWeight: 2.50, processWgt: 650.00, lengthInMeter: 1100.0 },
        { no: 2, width: 220, sets: 1, trimmingWeight: 1.80, processWgt: 450.00, lengthInMeter: 800.0 }
      ],
      totals: {
        trimmingWeight: 4.30,
        processWgt: 1100.00,
        lengthInMeter: 1900.0
      }
    };
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    setCurrentPage(1);
  };

  const handleShowAll = () => {
    console.log('Show all records');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleReportClick = (jobNo) => {
    console.log('Report clicked for job:', jobNo);
    const reportData = getSlittingReportData(jobNo);
    setSelectedJob(reportData);
  };

  // If jobData is provided and showAsPopup is true, show the detailed report directly
  useEffect(() => {
    if (jobData && showAsPopup) {
      const reportData = getSlittingReportData(jobData.jobNo);
      setSelectedJob(reportData);
    }
  }, [jobData, showAsPopup]);

  const handleBackToList = () => {
    if (showAsPopup) {
      onClose(); // Close the popup if it's shown as popup
    } else {
      setSelectedJob(null); // Go back to list if it's normal view
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        First
      </button>
    );

    buttons.push(
      <button
        key="previous"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>
    );

    for (let i = 1; i <= Math.min(10, totalPages); i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Last
      </button>
    );

    return buttons;
  };

  // Show detailed report view
  if (selectedJob) {
    return (
      <div className={showAsPopup ? "process-qc-overlay" : "slitting-detail-container"}>
        <div className={showAsPopup ? "process-qc-container" : ""}>
        <div className="slitting-detail-header">
          <button className="back-btn" onClick={handleBackToList}>
            ← {showAsPopup ? 'Back to Process QC' : 'Back to List'}
          </button>
          <button className="print-btn" onClick={handlePrint}>
            Print Slitting Report
          </button>
        </div>

        <div className="slitting-report-content">
          {/* Header Information */}
          <div className="report-header-grid">
            <div className="header-item">
              <span className="header-label">Drawing No</span>
              <span className="header-value">{selectedJob.header.drawingNo}</span>
            </div>
            <div className="header-item">
              <span className="header-label">W/O No.</span>
              <span className="header-value">{selectedJob.header.woNo}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Gauge</span>
              <span className="header-value">{selectedJob.header.gauge}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Quality</span>
              <span className="header-value">{selectedJob.header.quality}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Job Nature</span>
              <span className="header-value">{selectedJob.header.jobNature}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Employee</span>
              <span className="header-value">{selectedJob.header.employee}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Job No</span>
              <span className="header-value">{selectedJob.header.jobNo}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Sets</span>
              <span className="header-value">{selectedJob.header.sets}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Density</span>
              <span className="header-value">{selectedJob.header.density}</span>
            </div>
            <div className="header-item">
              <span className="header-label">Stacking Factor</span>
              <span className="header-value">{selectedJob.header.stackingFactor}</span>
            </div>
          </div>

          {/* Main Table */}
          <div className="slitting-table-container">
            <table className="slitting-detail-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Width</th>
                  <th>Sets</th>
                  <th>Trimming Weight</th>
                  <th>Process Wgt.</th>
                  <th>Length In Meter</th>
                </tr>
              </thead>
              <tbody>
                {selectedJob.tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.no}</td>
                    <td>{row.width}</td>
                    <td>{row.sets}</td>
                    <td>{row.trimmingWeight}</td>
                    <td>{row.processWgt}</td>
                    <td>{row.lengthInMeter}</td>
                  </tr>
                ))}
                <tr className="totals-row">
                  <td><strong>Total</strong></td>
                  <td><strong>--</strong></td>
                  <td><strong>--</strong></td>
                  <td><strong>{selectedJob.totals.trimmingWeight}</strong></td>
                  <td><strong>{selectedJob.totals.processWgt}</strong></td>
                  <td><strong>{selectedJob.totals.lengthInMeter}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // If shown as popup but no job selected, close it
  if (showAsPopup && !selectedJob) {
    return null;
  }

  // Show job list view
  return (
    <div className="slitting-reports-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="DRW NO/JOB NO./W/O NO :"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Go
          </button>
          <button onClick={handleShowAll} className="show-all-btn">
            Show All
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="reports-header">
        <h1>Slitting Reports</h1>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        {renderPaginationButtons()}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="slitting-reports-table">
          <thead>
            <tr>
              <th>JOB NO</th>
              <th>DRAWING NO</th>
              <th>W/O NO</th>
              <th>JOB NATURE</th>
              <th>QUALITY</th>
              <th>SETS</th>
              <th>DENSITY</th>
              <th>GAUGE</th>
              <th>STACKING FACTOR</th>
              <th>CREATED</th>
              <th>SLITTING REPORT</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index}>
                <td>{row.jobNo}</td>
                <td>{row.drawingNo}</td>
                <td>{row.woNo}</td>
                <td>{row.jobNature}</td>
                <td>{row.quality}</td>
                <td>{row.sets}</td>
                <td>{row.density}</td>
                <td>{row.gauge}</td>
                <td>{row.stackingFactor}</td>
                <td>{row.created}</td>
                <td>
                  <button 
                    className="report-btn"
                    onClick={() => handleReportClick(row.jobNo)}
                  >
                    Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="actions-section">
        <button className="close-btn" onClick={() => window.history.back()}>
          Back to Jobwork
        </button>
      </div>
    </div>
  );
};

export default SlittingReports;