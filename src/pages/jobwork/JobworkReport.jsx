import React, { useState } from 'react';
import '../../styles/jobworkReport.css';

const JobworkReport = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for jobwork list
  const jobworkList = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
    }
  ];

  // Mock detailed report data
  const getDetailedReport = (jobId) => {
    return {
      header: {
        drawingNo: '1000KVA-SOLAR(C-5968)KOKILA-CORE',
        woNo: 'WO/B/25-26/3635',
        gauge: '0.267',
        quality: 'M4/0.27',
        jobNature: 'OVER LAP',
        employee: 'Danish',
        dispatchDate: '0000-00-00',
        jobNo: 'NTPL/09/25/11951',
        sets: '1',
        density: '7.65',
        stackingFactor: '97.00%',
        reqCoreWeight: '1078'
      },
      outerLimbPlate: {
        title: 'OUTER LIMB PLATE',
        tipcut: 'YES / NO',
        reqOuterWeight: '0',
        holes: '0',
        holeDiameter: '0',
        data: [
          { no: 1, length: 940, width: 230, drawingWgt: 128.450, processWgt: 128.446, strips: 397, totalStack: 106.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 2, length: 930, width: 225, drawingWgt: 42.370, processWgt: 42.114, strips: 135, totalStack: 36.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 3, length: 910, width: 215, drawingWgt: 57.660, processWgt: 57.434, strips: 195, totalStack: 52.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 4, length: 890, width: 205, drawingWgt: 41.680, processWgt: 41.455, strips: 150, totalStack: 40.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 5, length: 870, width: 195, drawingWgt: 31.260, processWgt: 31.033, strips: 120, totalStack: 32.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 6, length: 850, width: 185, drawingWgt: 25.560, processWgt: 25.350, strips: 105, totalStack: 28.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 7, length: 830, width: 175, drawingWgt: 20.410, processWgt: 20.212, strips: 90, totalStack: 24.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 8, length: 800, width: 160, drawingWgt: 22.800, processWgt: 22.723, strips: 112, totalStack: 30.01, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 9, length: 770, width: 145, drawingWgt: 17.480, processWgt: 17.417, strips: 97, totalStack: 25.99, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 10, length: 740, width: 130, drawingWgt: 12.950, processWgt: 12.883, strips: 82, totalStack: 22.01, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 11, length: 700, width: 110, drawingWgt: 11.560, processWgt: 11.444, strips: 90, totalStack: 24.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 12, length: 660, width: 90, drawingWgt: 6.850, processWgt: 6.810, strips: 67, totalStack: 17.99, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' },
          { no: 13, length: 620, width: 70, drawingWgt: 4.000, processWgt: 3.967, strips: 52, totalStack: 14.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', length: '', width: '', burrL: '', operator: '' }
        ],
        totals: { drawingWgt: 423.030, processWgt: 421.287, strips: 1693, totalStack: 452.00 }
      },
      centerLimbPlate: {
        title: 'CENTER LIMB PLATE',
        tipcut: 'YES / NO',
        reqCenterWeight: '0',
        holes: '0',
        holeDiameter: '0',
        difference: '',
        data: [
          { no: 1, length: 710, width: 230, drawingWgt: 53.740, processWgt: 64.061, strips: 198, totalStack: 52.92, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 2, length: 705, width: 225, drawingWgt: 17.780, processWgt: 21.057, strips: 67, totalStack: 17.97, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 3, length: 695, width: 215, drawingWgt: 24.330, processWgt: 28.717, strips: 97, totalStack: 25.96, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 4, length: 685, width: 205, drawingWgt: 17.690, processWgt: 20.588, strips: 75, totalStack: 19.96, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 5, length: 675, width: 195, drawingWgt: 13.350, processWgt: 15.386, strips: 60, totalStack: 15.98, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 6, length: 665, width: 185, drawingWgt: 10.980, processWgt: 12.675, strips: 52, totalStack: 13.97, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 7, length: 655, width: 175, drawingWgt: 8.820, processWgt: 9.993, strips: 45, totalStack: 11.97, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 8, length: 640, width: 160, drawingWgt: 9.950, processWgt: 11.361, strips: 56, totalStack: 14.97, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 9, length: 625, width: 145, drawingWgt: 7.710, processWgt: 8.619, strips: 49, totalStack: 12.97, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 10, length: 610, width: 130, drawingWgt: 5.770, processWgt: 6.442, strips: 41, totalStack: 10.98, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 11, length: 595, width: 110, drawingWgt: 4.220, processWgt: 4.695, strips: 35, totalStack: 9.37, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' }
        ],
        totals: { drawingWgt: 180.340, processWgt: 209.894, strips: 845, totalStack: 225.50 }
      },
      yokeLimbPlates: {
        title: 'YOKE LIMB PLATES',
        tipcut: 'YES / NO',
        reqYokeWeight: '0',
        holes: '0',
        holeDiameter: '0',
        data: [
          { no: 1, length: 1040, width: 230, drawingWgt: 136.130, processWgt: 146.168, strips: 397, totalStack: 106.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 2, length: 1035, width: 225, drawingWgt: 45.300, processWgt: 48.386, strips: 135, totalStack: 36.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 3, length: 1025, width: 215, drawingWgt: 62.740, processWgt: 66.958, strips: 195, totalStack: 52.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 4, length: 1015, width: 205, drawingWgt: 46.170, processWgt: 49.020, strips: 150, totalStack: 40.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 5, length: 1005, width: 195, drawingWgt: 35.250, processWgt: 37.240, strips: 120, totalStack: 32.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 6, length: 995, width: 185, drawingWgt: 29.360, processWgt: 30.877, strips: 105, totalStack: 28.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 7, length: 985, width: 175, drawingWgt: 23.880, processWgt: 24.995, strips: 90, totalStack: 24.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 8, length: 970, width: 160, drawingWgt: 27.420, processWgt: 28.759, strips: 112, totalStack: 29.99, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 9, length: 955, width: 145, drawingWgt: 21.640, processWgt: 22.572, strips: 97, totalStack: 25.99, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 10, length: 940, width: 130, drawingWgt: 16.500, processWgt: 17.108, strips: 82, totalStack: 22.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 11, length: 920, width: 110, drawingWgt: 15.330, processWgt: 15.711, strips: 90, totalStack: 24.00, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 12, length: 900, width: 90, drawingWgt: 9.470, processWgt: 9.677, strips: 67, totalStack: 18.01, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' },
          { no: 13, length: 880, width: 70, drawingWgt: 5.760, processWgt: 5.842, strips: 52, totalStack: 13.99, observedGauge: '', actualStrips: '', actualWgt: '', holePitch: '', difference: '', length: '', width: '', burrL: '', operator: '' }
        ],
        totals: { drawingWgt: 474.950, processWgt: 503.291, strips: 1693, totalStack: 451.98 },
        grossTotal: { drawingWgt: 1078.320, processWgt: 1134.472, strips: 4230, totalStack: 1129.48 }
      }
    };
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(jobworkList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleJobClick = (job) => {
    const detailedData = getDetailedReport(job.id);
    setSelectedJob(detailedData);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleShowAll = () => {
    console.log('Show all records');
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

  if (selectedJob) {
    return (
      <div className="jobcard-report-overlay">
        <div className="jobcard-report-container">
          {/* Header */}
          <div className="jobcard-header">
            <div className="header-left">
              <button className="logout-btn">Logout</button>
            </div>
            <div className="header-center">
              <h1>Jobcard Report</h1>
            </div>
            <div className="header-right">
              <span className="welcome-text">Welcome Danish</span>
              <div className="header-actions">
                <button className="header-action-btn">Edit widths</button>
                <span>|</span>
                <button className="header-action-btn">Edit Material Type</button>
                <span>|</span>
                <button className="header-action-btn" onClick={handlePrint}>Print</button>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="job-details-grid">
            <div className="detail-item">
              <span className="detail-label">Drawing No</span>
              <span className="detail-value">{selectedJob.header.drawingNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">W/O No.</span>
              <span className="detail-value">{selectedJob.header.woNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gauge</span>
              <span className="detail-value">{selectedJob.header.gauge}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quality</span>
              <span className="detail-value">{selectedJob.header.quality}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Job Nature</span>
              <span className="detail-value">{selectedJob.header.jobNature}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Employee</span>
              <span className="detail-value">{selectedJob.header.employee}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Job No</span>
              <span className="detail-value">{selectedJob.header.jobNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sets</span>
              <span className="detail-value">{selectedJob.header.sets}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Density</span>
              <span className="detail-value">{selectedJob.header.density}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stacking Factor</span>
              <span className="detail-value">{selectedJob.header.stackingFactor}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Req. Core Weight</span>
              <span className="detail-value">{selectedJob.header.reqCoreWeight}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Dispatch Date</span>
              <span className="detail-value">{selectedJob.header.dispatchDate}</span>
            </div>
          </div>

          {/* Outer Limb Plate Table */}
          <div className="plate-section">
            <div className="plate-header">
              <div className="plate-title-row">
                <h3>OUTER LIMB PLATE</h3>
                <div className="plate-info">
                  <span>TIPCUT: {selectedJob.outerLimbPlate.tipcut}</span>
                  <span>Req. Outer Weight: {selectedJob.outerLimbPlate.reqOuterWeight}</span>
                </div>
              </div>
              <div className="hole-info">
                <span>Holes: {selectedJob.outerLimbPlate.holes}</span>
                <span>Hole Dia(mm): {selectedJob.outerLimbPlate.holeDiameter}</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="jobcard-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Length</th>
                    <th>Width</th>
                    <th>Drawing Wgt.</th>
                    <th>Process Wgt.</th>
                    <th>Strips</th>
                    <th>Total Stack</th>
                    <th>Observed Gauge</th>
                    <th>Actual Strips</th>
                    <th>Actual Wgt.</th>
                    <th>Hole Pitch</th>
                    <th colSpan="2">Observed</th>
                    <th>Burr L (micron)</th>
                    <th>Operator</th>
                  </tr>
                  <tr>
                    <th colSpan="10"></th>
                    <th>Length</th>
                    <th>Width</th>
                    <th colSpan="2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.outerLimbPlate.data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.no}</td>
                      <td>{row.length}</td>
                      <td>{row.width}</td>
                      <td>{row.drawingWgt}</td>
                      <td>{row.processWgt}</td>
                      <td>{row.strips}</td>
                      <td>{row.totalStack}</td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td colSpan="3"><strong>Total</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.totals.drawingWgt}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.totals.processWgt}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.totals.strips}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.totals.totalStack}</strong></td>
                    <td colSpan="8"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Center Limb Plate Table */}
          <div className="plate-section">
            <div className="plate-header">
              <div className="plate-title-row">
                <h3>CENTER LIMB PLATE</h3>
                <div className="plate-info">
                  <span>TIPCUT: {selectedJob.centerLimbPlate.tipcut}</span>
                  <span>Req. Center Weight: {selectedJob.centerLimbPlate.reqCenterWeight}</span>
                </div>
              </div>
              <div className="hole-info">
                <span>Holes: {selectedJob.centerLimbPlate.holes}</span>
                <span>Hole Dia(mm): {selectedJob.centerLimbPlate.holeDiameter}</span>
                <span>Difference: {selectedJob.centerLimbPlate.difference}</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="jobcard-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Length</th>
                    <th>Width</th>
                    <th>Drawing Wgt.</th>
                    <th>Process Wgt.</th>
                    <th>Strips</th>
                    <th>Total Stack</th>
                    <th>Observed Gauge</th>
                    <th>Actual Strips</th>
                    <th>Actual Wgt.</th>
                    <th>Hole Pitch</th>
                    <th>Difference</th>
                    <th colSpan="2">Observed</th>
                    <th>Burr L (micron)</th>
                    <th>Operator</th>
                  </tr>
                  <tr>
                    <th colSpan="12"></th>
                    <th>Length</th>
                    <th>Width</th>
                    <th colSpan="2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.centerLimbPlate.data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.no}</td>
                      <td>{row.length}</td>
                      <td>{row.width}</td>
                      <td>{row.drawingWgt}</td>
                      <td>{row.processWgt}</td>
                      <td>{row.strips}</td>
                      <td>{row.totalStack}</td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td colSpan="3"><strong>Total</strong></td>
                    <td><strong>{selectedJob.centerLimbPlate.totals.drawingWgt}</strong></td>
                    <td><strong>{selectedJob.centerLimbPlate.totals.processWgt}</strong></td>
                    <td><strong>{selectedJob.centerLimbPlate.totals.strips}</strong></td>
                    <td><strong>{selectedJob.centerLimbPlate.totals.totalStack}</strong></td>
                    <td colSpan="9"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Yoke Limb Plates Table */}
          <div className="plate-section">
            <div className="plate-header">
              <div className="plate-title-row">
                <h3>YOKE LIMB PLATES</h3>
                <div className="plate-info">
                  <span>TIPCUT: {selectedJob.yokeLimbPlates.tipcut}</span>
                  <span>Req. Yoke Weight: {selectedJob.yokeLimbPlates.reqYokeWeight}</span>
                </div>
              </div>
              <div className="hole-info">
                <span>Holes: {selectedJob.yokeLimbPlates.holes}</span>
                <span>Hole Dia(mm): {selectedJob.yokeLimbPlates.holeDiameter}</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="jobcard-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Length</th>
                    <th>Width</th>
                    <th>Drawing Wgt.</th>
                    <th>Process Wgt.</th>
                    <th>Strips</th>
                    <th>Total Stack</th>
                    <th>Observed Gauge</th>
                    <th>Actual Strips</th>
                    <th>Actual Wgt.</th>
                    <th>Hole Pitch</th>
                    <th>Difference</th>
                    <th colSpan="2">Observed</th>
                    <th>Burr L (micron)</th>
                    <th>Operator</th>
                  </tr>
                  <tr>
                    <th colSpan="12"></th>
                    <th>Length</th>
                    <th>Width</th>
                    <th colSpan="2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.yokeLimbPlates.data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.no}</td>
                      <td>{row.length}</td>
                      <td>{row.width}</td>
                      <td>{row.drawingWgt}</td>
                      <td>{row.processWgt}</td>
                      <td>{row.strips}</td>
                      <td>{row.totalStack}</td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                      <td><input type="text" className="editable-input" /></td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td colSpan="3"><strong>Total</strong></td>
                    <td><strong>{selectedJob.yokeLimbPlates.totals.drawingWgt}</strong></td>
                    <td><strong>{selectedJob.yokeLimbPlates.totals.processWgt}</strong></td>
                    <td><strong>{selectedJob.yokeLimbPlates.totals.strips}</strong></td>
                    <td><strong>{selectedJob.yokeLimbPlates.totals.totalStack}</strong></td>
                    <td colSpan="9"></td>
                  </tr>
                  <tr className="grand-totals-row">
                    <td colSpan="3"><strong>Gross Total</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.grossTotal.drawingWgt}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.grossTotal.processWgt}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.grossTotal.strips}</strong></td>
                    <td><strong>{selectedJob.outerLimbPlate.grossTotal.totalStack}</strong></td>
                    <td colSpan="9"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Close Button */}
          <div className="jobcard-actions">
            <button className="close-btn" onClick={() => setSelectedJob(null)}>
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobwork-reports-overlay">
      <div className="jobwork-reports-container">
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
          <h1>Jobwork Reports</h1>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          {renderPaginationButtons()}
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="jobwork-reports-table">
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
              </tr>
            </thead>
            <tbody>
              {jobworkList.map((row, index) => (
                <tr key={index} onClick={() => handleJobClick(row)} className="clickable-row">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="actions-section">
          <button className="close-btn" onClick={() => window.history.back()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobworkReport;