import React, { useState } from 'react';
import '../../styles/processQCReport.css';

const ProcessQCReport = ({ jobData, onClose }) => {
  const [currentSection, setCurrentSection] = useState('outer');

  // Mock data based on the images
  const reportData = {
    header: {
      density: '7.65',
      materialType: 'CRGO',
      stackingFactor: '97.00%',
      materialGrade: '20/70 & 20/80',
      reqCoreWeight: '419.63',
      dispatchDate: '0000-00-00',
      jobNo: 'NTPL/08/25/11875',
      woNo: 'WO/A/25-26/3635',
      drawingNo: '250KVA (C-5917) E',
      natureOfJob: 'OVER LAP',
      noOfSets: '1',
      employee: 'Danish'
    },
    outerLimbPlate: {
      title: 'OUTER LIMB PLATE',
      reqWeight: '161.02',
      noOfHoles: '0',
      holeDiameter: '0',
      difference: '',
      data: [
        { no: 1, length: 715, width: 160, drawingWgt: 46.98, processWgt: 46.50, noStrip: 366, proStack: 71.30, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 2, length: 700, width: 150, drawingWgt: 36.61, processWgt: 36.53, noStrip: 307, proStack: 59.80, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 3, length: 685, width: 140, drawingWgt: 23.44, processWgt: 23.41, noStrip: 212, proStack: 41.40, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 4, length: 670, width: 130, drawingWgt: 14.38, processWgt: 14.32, noStrip: 142, proStack: 27.61, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 5, length: 655, width: 120, drawingWgt: 10.96, processWgt: 10.87, noStrip: 118, proStack: 23.01, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 6, length: 640, width: 110, drawingWgt: 7.96, processWgt: 7.93, noStrip: 94, proStack: 18.40, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 7, length: 625, width: 100, drawingWgt: 7.17, processWgt: 7.14, noStrip: 94, proStack: 18.40, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 8, length: 610, width: 90, drawingWgt: 4.79, processWgt: 4.74, noStrip: 71, proStack: 13.79, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 9, length: 595, width: 80, drawingWgt: 4.22, processWgt: 4.17, noStrip: 71, proStack: 13.80, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 10, length: 580, width: 70, drawingWgt: 2.44, processWgt: 2.43, noStrip: 47, proStack: 9.21, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 11, length: 565, width: 60, drawingWgt: 2.07, processWgt: 2.06, noStrip: 47, proStack: 9.21, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' }
      ],
      totals: { drawingWgt: 161.02, processWgt: 160.50, noStrip: 1569, proStack: 305.93, actualStrips: 0, actualWgt: 0 }
    },
    centerLimbPlate: {
      title: 'CENTER LIMB PLATE',
      reqWeight: '70.24',
      noOfHoles: '0',
      holeDiameter: '0',
      difference: '',
      data: [
        { no: 1, length: 555, width: 160, drawingWgt: 20.08, processWgt: 23.39, noStrip: 182.592, proStack: 35.61, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 2, length: 550, width: 150, drawingWgt: 15.78, processWgt: 18.26, noStrip: 153.057, proStack: 29.85, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 3, length: 545, width: 140, drawingWgt: 10.20, processWgt: 11.70, noStrip: 106.001, proStack: 20.67, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 4, length: 540, width: 130, drawingWgt: 6.31, processWgt: 7.11, noStrip: 70.6195, proStack: 13.77, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 5, length: 535, width: 120, drawingWgt: 4.85, processWgt: 5.39, noStrip: 58.8029, proStack: 11.47, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 6, length: 530, width: 110, drawingWgt: 3.56, processWgt: 3.96, noStrip: 47.0864, proStack: 9.18, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 7, length: 525, width: 100, drawingWgt: 3.24, processWgt: 3.57, noStrip: 47.1394, proStack: 9.19, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 8, length: 520, width: 90, drawingWgt: 2.18, processWgt: 2.37, noStrip: 35.2414, proStack: 6.87, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 9, length: 515, width: 80, drawingWgt: 1.94, processWgt: 2.09, noStrip: 35.2818, proStack: 6.88, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 10, length: 510, width: 70, drawingWgt: 1.13, processWgt: 1.19, noStrip: 23.4865, proStack: 4.58, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 11, length: 505, width: 60, drawingWgt: 0.97, processWgt: 1.01, noStrip: 23.5212, proStack: 4.59, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' }
      ],
      totals: { drawingWgt: 70.24, processWgt: 80.04, noStrip: 783, proStack: 152.65, actualStrips: 0, actualWgt: 0 }
    },
    yokeLimbPlates: {
      title: 'YOKE LIMB PLATES',
      reqWeight: '188.37',
      noOfHoles: '0',
      holeDiameter: '0',
      difference: '',
      data: [
        { no: 1, length: 830, width: 150, drawingWgt: 53.33, processWgt: 56.62, noStrip: 356, proStack: 71.30, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 2, length: 820, width: 150, drawingWgt: 42.10, processWgt: 44.50, noStrip: 307, proStack: 59.80, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 3, length: 810, width: 140, drawingWgt: 27.31, processWgt: 28.77, noStrip: 212, proStack: 41.40, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 4, length: 800, width: 130, drawingWgt: 16.97, processWgt: 17.77, noStrip: 142, proStack: 27.59, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 5, length: 790, width: 120, drawingWgt: 13.11, processWgt: 13.61, noStrip: 118, proStack: 23.00, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 6, length: 780, width: 110, drawingWgt: 9.65, processWgt: 10.02, noStrip: 94, proStack: 18.40, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 7, length: 770, width: 100, drawingWgt: 8.81, processWgt: 9.11, noStrip: 94, proStack: 18.41, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 8, length: 760, width: 90, drawingWgt: 5.97, processWgt: 6.11, noStrip: 71, proStack: 13.81, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 9, length: 750, width: 80, drawingWgt: 5.32, processWgt: 5.43, noStrip: 71, proStack: 13.79, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 10, length: 740, width: 70, drawingWgt: 3.12, processWgt: 3.19, noStrip: 47, proStack: 9.21, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' },
        { no: 11, length: 730, width: 60, drawingWgt: 2.68, processWgt: 2.73, noStrip: 47, proStack: 9.19, obsThickness: '', actualStrips: '', actualWgt: '', holePitch: '', observedLength: '', observedWidth: '', burr: '', remark: '' }
      ],
      totals: { drawingWgt: 188.37, processWgt: 197.87, noStrip: 1569, proStack: 305.89, actualStrips: 0, actualWgt: 0 },
      grandTotal: { drawingWgt: 419.63, processWgt: 438.41, noStrip: 3920, proStack: 764.47, actualStrips: 0, actualWgt: 0 }
    }
  };

  const sections = [
    { key: 'outer', label: 'Outer Limb Plate', data: reportData.outerLimbPlate },
    { key: 'center', label: 'Center Limb Plate', data: reportData.centerLimbPlate },
    { key: 'yoke', label: 'Yoke Limb Plates', data: reportData.yokeLimbPlates }
  ];

  const handleSectionChange = (sectionKey) => {
    setCurrentSection(sectionKey);
  };

  const handleInputChange = (rowIndex, field, value) => {
    // Handle input changes for editable fields
    console.log(`Row ${rowIndex}, Field: ${field}, Value: ${value}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    console.log('Saving QC report data...');
    // Implement save functionality
  };

  const renderTable = (sectionData) => (
    <div className="qc-table-container">
      <div className="qc-section-header">
        <div className="section-title-row">
          <h3 className="section-title">{sectionData.title}</h3>
          <div className="section-info">
            <span>Req. {sectionData.title.split(' ')[0]} Weight: {sectionData.reqWeight}</span>
            {sectionData.difference && <span>Difference: {sectionData.difference}</span>}
          </div>
        </div>
        <div className="hole-info">
          <span>No Of Holes: {sectionData.noOfHoles}</span>
          <span>Hole Dia(mm): {sectionData.holeDiameter}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="qc-report-table">
          <thead>
            <tr>
              <th rowSpan="2">No</th>
              <th rowSpan="2">Length</th>
              <th rowSpan="2">Width</th>
              <th rowSpan="2">Drawing Wgt.</th>
              <th rowSpan="2">Process Wgt.</th>
              <th rowSpan="2">No. Strip</th>
              <th rowSpan="2">Pro. Stack</th>
              <th rowSpan="2">Obs. Thickness</th>
              <th rowSpan="2">Actual Strips</th>
              <th rowSpan="2">Actual Wgt.</th>
              <th rowSpan="2">Hole Pitch</th>
              <th colSpan="2">Observed</th>
              <th rowSpan="2">Burr L (micron)</th>
              <th rowSpan="2">Remark/Operator</th>
            </tr>
            <tr>
              <th>Length</th>
              <th>Width</th>
            </tr>
          </thead>
          <tbody>
            {sectionData.data.map((row, index) => (
              <tr key={index}>
                <td>{row.no}</td>
                <td>{row.length}</td>
                <td>{row.width}</td>
                <td>{row.drawingWgt}</td>
                <td>{row.processWgt}</td>
                <td>{row.noStrip}</td>
                <td>{row.proStack}</td>
                <td>
                  <input
                    type="text"
                    value={row.obsThickness}
                    onChange={(e) => handleInputChange(index, 'obsThickness', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.actualStrips}
                    onChange={(e) => handleInputChange(index, 'actualStrips', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.actualWgt}
                    onChange={(e) => handleInputChange(index, 'actualWgt', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.holePitch}
                    onChange={(e) => handleInputChange(index, 'holePitch', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.observedLength}
                    onChange={(e) => handleInputChange(index, 'observedLength', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.observedWidth}
                    onChange={(e) => handleInputChange(index, 'observedWidth', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.burr}
                    onChange={(e) => handleInputChange(index, 'burr', e.target.value)}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.remark}
                    onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                    className="editable-input"
                  />
                </td>
              </tr>
            ))}
            <tr className="totals-row">
              <td colSpan="3"><strong>Total</strong></td>
              <td><strong>{sectionData.totals.drawingWgt}</strong></td>
              <td><strong>{sectionData.totals.processWgt}</strong></td>
              <td><strong>{sectionData.totals.noStrip}</strong></td>
              <td><strong>{sectionData.totals.proStack}</strong></td>
              <td></td>
              <td><strong>{sectionData.totals.actualStrips}</strong></td>
              <td><strong>{sectionData.totals.actualWgt}</strong></td>
              <td colSpan="5"></td>
            </tr>
            {sectionData.grandTotal && (
              <tr className="grand-totals-row">
                <td colSpan="3"><strong>Grand Total</strong></td>
                <td><strong>{sectionData.grandTotal.drawingWgt}</strong></td>
                <td><strong>{sectionData.grandTotal.processWgt}</strong></td>
                <td><strong>{sectionData.grandTotal.noStrip}</strong></td>
                <td><strong>{sectionData.grandTotal.proStack}</strong></td>
                <td></td>
                <td><strong>{sectionData.grandTotal.actualStrips}</strong></td>
                <td><strong>{sectionData.grandTotal.actualWgt}</strong></td>
                <td colSpan="5"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="process-qc-overlay">
      <div className="process-qc-container">
        <div className="qc-header">
          <h1>Process QC Details Report</h1>
          <div className="employee-info">
            <span>Employee: {reportData.header.employee}</span>
          </div>
        </div>

        {/* Header Information */}
        <div className="qc-info-grid">
          <div className="info-item">
            <label>Density:</label>
            <span>{reportData.header.density}</span>
          </div>
          <div className="info-item">
            <label>Material Type:</label>
            <span>{reportData.header.materialType}</span>
          </div>
          <div className="info-item">
            <label>Stacking Factor:</label>
            <span>{reportData.header.stackingFactor}</span>
          </div>
          <div className="info-item">
            <label>Material Grade:</label>
            <span>{reportData.header.materialGrade}</span>
          </div>
          <div className="info-item">
            <label>Req. Core Weight:</label>
            <span>{reportData.header.reqCoreWeight}</span>
          </div>
          <div className="info-item">
            <label>Dispatch Date:</label>
            <span>{reportData.header.dispatchDate}</span>
          </div>
          <div className="info-item">
            <label>Job No:</label>
            <span>{reportData.header.jobNo}</span>
          </div>
          <div className="info-item">
            <label>W/O No:</label>
            <span>{reportData.header.woNo}</span>
          </div>
          <div className="info-item">
            <label>Drawing No:</label>
            <span>{reportData.header.drawingNo}</span>
          </div>
          <div className="info-item">
            <label>Nature of Job:</label>
            <span>{reportData.header.natureOfJob}</span>
          </div>
          <div className="info-item">
            <label>No Of Sets:</label>
            <span>{reportData.header.noOfSets}</span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="section-tabs">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`section-tab ${currentSection === section.key ? 'active' : ''}`}
              onClick={() => handleSectionChange(section.key)}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Current Section Table */}
        {sections.map((section) => (
          currentSection === section.key && (
            <div key={section.key}>
              {renderTable(section.data)}
            </div>
          )
        ))}

        {/* Action Buttons */}
        <div className="qc-actions">
          <button className="qc-btn qc-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="qc-btn qc-btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="qc-btn qc-btn-primary" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessQCReport;