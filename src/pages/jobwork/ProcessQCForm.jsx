import React, { useState, useEffect } from 'react';
import '../../styles/processQCForm.css';

const ProcessQCForm = ({ jobData, onClose, onSave }) => {
  // Mock data based on the image
  const [formData, setFormData] = useState({
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
    tableData: [
      { no: 1, length: 1375, width: 275, drawingWgt: 1375, processWgt: 1375, noStrip: 285.610, proStack: 304.67, obsThickness: 46, actualStrips: 230, actualWgt: 67.00, holePitch: 92.02, observedLength: 460, observedWidth: 135.73, burrL: 184.00 },
      { no: 2, length: 1365, width: 265, drawingWgt: 1365, processWgt: 1365, noStrip: 137.980, proStack: 146.83, obsThickness: 23, actualStrips: 115, actualWgt: 33.00, holePitch: 46.02, observedLength: 230, observedWidth: 67.68, burrL: 66.00 },
      { no: 3, length: 1355, width: 255, drawingWgt: 1355, processWgt: 1355, noStrip: 92.630, proStack: 98.29, obsThickness: 16, actualStrips: 80, actualWgt: 23.00, holePitch: 32.01, observedLength: 160, observedWidth: 47.22, burrL: 46.00 },
      { no: 4, length: 1345, width: 245, drawingWgt: 1345, processWgt: 1345, noStrip: 72.440, proStack: 76.71, obsThickness: 13, actualStrips: 65, actualWgt: 19.00, holePitch: 26.01, observedLength: 130, observedWidth: 38.36, burrL: 38.00 },
      { no: 5, length: 1325, width: 225, drawingWgt: 1325, processWgt: 1325, noStrip: 102.880, proStack: 108.43, obsThickness: 20, actualStrips: 100, actualWgt: 30.00, holePitch: 40.03, observedLength: 200, observedWidth: 59.04, burrL: 60.00 },
      { no: 6, length: 1305, width: 205, drawingWgt: 1305, processWgt: 1305, noStrip: 75.360, proStack: 79.02, obsThickness: 14, actualStrips: 80, actualWgt: 23.00, holePitch: 32.01, observedLength: 160, observedWidth: 47.22, burrL: 46.00 },
      { no: 7, length: 1285, width: 185, drawingWgt: 1285, processWgt: 1285, noStrip: 55.490, proStack: 57.92, obsThickness: 13, actualStrips: 65, actualWgt: 19.00, holePitch: 26.01, observedLength: 130, observedWidth: 38.36, burrL: 38.00 },
      { no: 8, length: 1265, width: 165, drawingWgt: 1265, processWgt: 1265, noStrip: 42.160, proStack: 43.78, obsThickness: 11, actualStrips: 55, actualWgt: 16.00, holePitch: 22.04, observedLength: 110, observedWidth: 32.51, burrL: 32.00 },
      { no: 9, length: 1245, width: 145, drawingWgt: 1245, processWgt: 1245, noStrip: 30.400, proStack: 31.43, obsThickness: 9, actualStrips: 45, actualWgt: 13.00, holePitch: 18.01, observedLength: 90, observedWidth: 26.56, burrL: 26.00 },
      { no: 10, length: 1215, width: 115, drawingWgt: 1215, processWgt: 1215, noStrip: 28.660, proStack: 30.67, obsThickness: 11, actualStrips: 55, actualWgt: 16.00, holePitch: 22.01, observedLength: 110, observedWidth: 32.46, burrL: 32.00 },
      { no: 11, length: 1185, width: 85, drawingWgt: 1185, processWgt: 1185, noStrip: 18.070, proStack: 14.35, obsThickness: 7, actualStrips: 35, actualWgt: 11.00, holePitch: 14.02, observedLength: 70, observedWidth: 20.68, burrL: 22.00 }
    ]
  });

  const handleInputChange = (rowIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.map((row, index) => 
        index === rowIndex ? { ...row, [field]: parseFloat(value) || 0 } : row
      )
    }));
  };

  const handleArrowClick = (rowIndex, field, direction) => {
    const increment = direction === 'up' ? 1 : -1;
    const currentValue = formData.tableData[rowIndex][field] || 0;
    const newValue = Math.max(0, currentValue + increment);
    handleInputChange(rowIndex, field, newValue);
  };

  const calculateTotals = () => {
    return formData.tableData.reduce((totals, row) => ({
      drawingWgt: totals.drawingWgt + (row.drawingWgt || 0),
      processWgt: totals.processWgt + (row.processWgt || 0),
      noStrip: totals.noStrip + (row.noStrip || 0),
      proStack: totals.proStack + (row.proStack || 0),
      actualStrips: totals.actualStrips + (row.actualStrips || 0),
      actualWgt: totals.actualWgt + (row.actualWgt || 0)
    }), { drawingWgt: 0, processWgt: 0, noStrip: 0, proStack: 0, actualStrips: 0, actualWgt: 0 });
  };

  const totals = calculateTotals();

  const handleSave = () => {
    console.log('Saving Process QC Form data...', formData);
    if (onSave) onSave(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="process-qc-form-overlay">
      <div className="process-qc-form-container">
        <div className="qc-form-header">
          <h1>Process QC Form</h1>
          <div className="employee-info">
            <span>Employee: {formData.header.employee}</span>
          </div>
        </div>

        {/* Header Information */}
        <div className="qc-form-info-grid">
          <div className="info-item">
            <label>Density:</label>
            <input 
              type="text" 
              value={formData.header.density}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, density: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Material Type:</label>
            <input 
              type="text" 
              value={formData.header.materialType}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, materialType: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Stacking Factor:</label>
            <input 
              type="text" 
              value={formData.header.stackingFactor}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, stackingFactor: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Material Grade:</label>
            <input 
              type="text" 
              value={formData.header.materialGrade}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, materialGrade: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Req. Core Weight:</label>
            <input 
              type="text" 
              value={formData.header.reqCoreWeight}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, reqCoreWeight: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Dispatch Date:</label>
            <input 
              type="date" 
              value={formData.header.dispatchDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, dispatchDate: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Job No:</label>
            <input 
              type="text" 
              value={formData.header.jobNo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, jobNo: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>W/O No:</label>
            <input 
              type="text" 
              value={formData.header.woNo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, woNo: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Drawing No:</label>
            <input 
              type="text" 
              value={formData.header.drawingNo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, drawingNo: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>Nature of Job:</label>
            <input 
              type="text" 
              value={formData.header.natureOfJob}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, natureOfJob: e.target.value }
              }))}
            />
          </div>
          <div className="info-item">
            <label>No Of Sets:</label>
            <input 
              type="text" 
              value={formData.header.noOfSets}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                header: { ...prev.header, noOfSets: e.target.value }
              }))}
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="qc-form-table-container">
          <div className="table-wrapper">
            <table className="qc-form-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Length</th>
                  <th>Width</th>
                  <th>Drawing Wgt.</th>
                  <th>Process Wgt.</th>
                  <th>No. Strip</th>
                  <th>Pro. Stack</th>
                  <th>Obs. Thickness</th>
                  <th>Actual Strips</th>
                  <th>Actual Wgt.</th>
                  <th>Hole Pitch</th>
                  <th>Observed Length</th>
                  <th>Observed Width</th>
                  <th>Burr L (micron)</th>
                </tr>
              </thead>
              <tbody>
                {formData.tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.no}</td>
                    <td>
                      <input
                        type="number"
                        value={row.length}
                        onChange={(e) => handleInputChange(index, 'length', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.width}
                        onChange={(e) => handleInputChange(index, 'width', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.drawingWgt}
                        onChange={(e) => handleInputChange(index, 'drawingWgt', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.processWgt}
                        onChange={(e) => handleInputChange(index, 'processWgt', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={row.noStrip}
                        onChange={(e) => handleInputChange(index, 'noStrip', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <div className="input-with-arrows">
                        <input
                          type="number"
                          step="0.01"
                          value={row.proStack}
                          onChange={(e) => handleInputChange(index, 'proStack', e.target.value)}
                          className="form-input"
                        />
                        <div className="arrow-controls">
                          <button
                            type="button"
                            className="arrow-btn up"
                            onClick={() => handleArrowClick(index, 'proStack', 'up')}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="arrow-btn down"
                            onClick={() => handleArrowClick(index, 'proStack', 'down')}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.obsThickness}
                        onChange={(e) => handleInputChange(index, 'obsThickness', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <div className="input-with-arrows">
                        <input
                          type="number"
                          value={row.actualStrips}
                          onChange={(e) => handleInputChange(index, 'actualStrips', e.target.value)}
                          className="form-input"
                        />
                        <div className="arrow-controls">
                          <button
                            type="button"
                            className="arrow-btn up"
                            onClick={() => handleArrowClick(index, 'actualStrips', 'up')}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="arrow-btn down"
                            onClick={() => handleArrowClick(index, 'actualStrips', 'down')}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.actualWgt}
                        onChange={(e) => handleInputChange(index, 'actualWgt', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.holePitch}
                        onChange={(e) => handleInputChange(index, 'holePitch', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.observedLength}
                        onChange={(e) => handleInputChange(index, 'observedLength', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.observedWidth}
                        onChange={(e) => handleInputChange(index, 'observedWidth', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.burrL}
                        onChange={(e) => handleInputChange(index, 'burrL', e.target.value)}
                        className="form-input"
                      />
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="totals-row">
                  <td><strong>Total</strong></td>
                  <td></td>
                  <td></td>
                  <td><strong>{totals.drawingWgt.toFixed(2)}</strong></td>
                  <td><strong>{totals.processWgt.toFixed(2)}</strong></td>
                  <td><strong>{totals.noStrip.toFixed(3)}</strong></td>
                  <td><strong>{totals.proStack.toFixed(2)}</strong></td>
                  <td></td>
                  <td><strong>{totals.actualStrips}</strong></td>
                  <td><strong>{totals.actualWgt.toFixed(2)}</strong></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><strong>{totals.burrL ? totals.burrL.toFixed(2) : '0.00'}</strong></td>
                </tr>

                {/* Grand Total Row */}
                <tr className="grand-totals-row">
                  <td><strong>Grand Total</strong></td>
                  <td></td>
                  <td></td>
                  <td><strong>2461.000</strong></td>
                  <td><strong>2549.760</strong></td>
                  <td><strong>466</strong></td>
                  <td><strong>2316</strong></td>
                  <td></td>
                  <td><strong>679.85</strong></td>
                  <td><strong>592.452</strong></td>
                  <td><strong>4625</strong></td>
                  <td></td>
                  <td></td>
                  <td><strong>546.02</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="qc-form-actions">
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

export default ProcessQCForm;