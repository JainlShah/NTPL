import React, { useState, useEffect } from 'react';
import ProcessQCReport from './ProcessQCReport';
import SlittingReports from './SlittingReports';
import '../../styles/finalQC.css';

const FinalQC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showProcessQCReport, setShowProcessQCReport] = useState(false);
  const [showSlittingReports, setShowSlittingReports] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Mock data based on the image
  const mockData = [
    {
      jobNo: 'NTPL/09/25/11951',
      drwNo: '1000KVA-SOLAR(C-5965)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 1,
      gauge: 0.257,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11948',
      drwNo: 'ET-3 (C-5967)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 2,
      gauge: 0.257,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11947',
      drwNo: 'U-55 (C-5966)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 1,
      gauge: 0.265,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11946',
      drwNo: '630-KVA (C-5965)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 4,
      gauge: 0.257,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11945',
      drwNo: '1250KVA (C-5964)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 3,
      gauge: 0.265,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11944',
      drwNo: '1000-D KVA (C-5963)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 5,
      gauge: 0.265,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    },
    {
      jobNo: 'NTPL/09/25/11943',
      drwNo: '750KVA (C-5962)KOKILA-CORE',
      woNo: 'WO/B/25-26/3635',
      jobNature: 'OVER LAP',
      sets: 2,
      gauge: 0.265,
      jobPrinciple: 'View',
      processQcForm: 'Edit',
      processQcReport: 'View',
      slittingReport: 'Report',
      jobIdTags: 'View'
    }
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleActionClick = (action, jobNo) => {
    console.log(`${action} clicked for job: ${jobNo}`);
    
    if (action === 'processReport') {
      const job = mockData.find(item => item.jobNo === jobNo);
      setSelectedJob(job);
      setShowProcessQCReport(true);
    } else if (action === 'slittingReport') {
      const job = mockData.find(item => item.jobNo === jobNo);
      setSelectedJob(job);
      setShowSlittingReports(true);
    }
    // Handle other actions here
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
    <div className="final-qc-container">
      <div className="final-qc-header">
        <h1>In Process Qc</h1>
      </div>

      <div className="pagination-container">
        {renderPaginationButtons()}
      </div>

      <div className="table-container">
        <table className="final-qc-table">
          <thead>
            <tr>
              <th>JOB NO.</th>
              <th>DRW NO</th>
              <th>W/O NO</th>
              <th>JOB NATURE</th>
              <th>SETS</th>
              <th>GAUGE</th>
              <th>JOB PRINCIPLE</th>
              <th>PROCESS QC FORM</th>
              <th>PROCESS QC REPORT</th>
              <th>SLITTING REPORT</th>
              <th>JOB ID TAGS</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index}>
                <td>{row.jobNo}</td>
                <td>{row.drwNo}</td>
                <td>{row.woNo}</td>
                <td>{row.jobNature}</td>
                <td>{row.sets}</td>
                <td>{row.gauge}</td>
                <td>
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleActionClick('view', row.jobNo)}
                  >
                    {row.jobPrinciple}
                  </button>
                </td>
                <td>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleActionClick('edit', row.jobNo)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleActionClick('processReport', row.jobNo)}
                  >
                    {row.processQcReport}
                  </button>
                </td>
                <td>
                  <button 
                    className="action-btn report-btn"
                    onClick={() => handleActionClick('slittingReport', row.jobNo)}
                  >
                    {row.slittingReport}
                  </button>
                </td>
                <td>
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleActionClick('jobTags', row.jobNo)}
                  >
                    {row.jobIdTags}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showProcessQCReport && (
        <ProcessQCReport
          jobData={selectedJob}
          onClose={() => {
            setShowProcessQCReport(false);
            setSelectedJob(null);
          }}
        />
      )}

      {showSlittingReports && (
        <SlittingReports
          jobData={selectedJob}
          onClose={() => {
            setShowSlittingReports(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default FinalQC;