import React, { useState, useEffect } from 'react';
import '../../styles/slittingReports.css';

const SlittingReports = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data based on the image
  const mockData = [
    {
      jobNo: 'NTPL/09/25/11951',
      drawingNo: '1000KVA-SOLAR(C-5968)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 1,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    },
    {
      jobNo: 'NTPL/09/25/11948',
      drawingNo: 'ET-3 (C-5967)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 2,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    },
    {
      jobNo: 'NTPL/09/25/11947',
      drawingNo: 'U-55 (C-5966)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27MM',
      sets: 1,
      density: 7.65,
      gauge: 0.265,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    },
    {
      jobNo: 'NTPL/09/25/11946',
      drawingNo: '630-KVA (C-5965)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 4,
      density: 7.65,
      gauge: 0.267,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    },
    {
      jobNo: 'NTPL/09/25/11945',
      drawingNo: '1250KVA (C-5964)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 3,
      density: 7.65,
      gauge: 0.265,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    },
    {
      jobNo: 'NTPL/09/25/11944',
      drawingNo: '1000-D KVA (C-5963)KOKILA-CORE',
      jobNature: 'OVER LAP',
      quality: 'M4/0.27',
      sets: 5,
      density: 7.65,
      gauge: 0.265,
      stackingFactor: 97,
      created: '03-09-2025',
      slittingReport: 'Report'
    }
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const handleShowAll = () => {
    console.log('Show all records');
    // Implement show all functionality
  };

  const handleReportClick = (jobNo) => {
    console.log('Report clicked for job:', jobNo);
    // Implement report functionality
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // First button
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

    // Previous button
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

    // Page numbers (showing 1-10 as in the image)
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

    // Next button
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

    // Last button
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

  return (
    <div className="slitting-reports-overlay">
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
                      {row.slittingReport}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="actions-section">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlittingReports;