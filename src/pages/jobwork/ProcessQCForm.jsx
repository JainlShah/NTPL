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
    ]
  });

  // Smart calculation logic for related fields
  const calculateRelatedFields = (rowIndex, baseField, newValue) => {
    const row = formData.tableData[rowIndex];
    const updatedRow = { ...row };
    
    if (baseField === 'actualStrips') {
      // When actual strips change, update related fields
      updatedRow.actualStrips = newValue;
      // Calculate actual weight based on strips (example logic)
      updatedRow.actualWgt = (newValue * 0.29).toFixed(2);
      // Calculate hole pitch based on strips
      updatedRow.holePitch = (newValue * 0.4).toFixed(2);
      // Calculate observed length and width
      updatedRow.observedLength = newValue * 2;
      updatedRow.observedWidth = (newValue * 0.29).toFixed(2);
    } else if (baseField === 'proStack') {
      // When pro stack changes, update related fields
      updatedRow.proStack = newValue;
      // Update observed thickness based on stack
      updatedRow.obsThickness = Math.round(newValue * 0.65);
    }
    
    return updatedRow;
  };

  const handleInputChange = (rowIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.map((row, index) => 
        index === rowIndex ? { ...row, [field]: parseFloat(value) || 0 } : row
      )
    }));
  };

  const handleSmartArrowClick = (rowIndex, direction) => {
    const increment = direction === 'up' ? 1 : -1;
    const currentRow = formData.tableData[rowIndex];
    
    // Determine which field to modify based on current context
    // Priority: actualStrips > proStack
    let primaryField = 'actualStrips';
    let currentValue = currentRow.actualStrips || 0;
    
    // If actualStrips is 0 or empty, use proStack
    if (currentValue === 0) {
      primaryField = 'proStack';
      currentValue = currentRow.proStack || 0;
    }
    
    const newValue = Math.max(0, currentValue + increment);
    const updatedRow = calculateRelatedFields(rowIndex, primaryField, newValue);
    
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.map((row, index) => 
        index === rowIndex ? updatedRow : row
      )
    }));
  };

  const calculateTotals = () => {
    return formData.tableData.reduce((totals, row) => ({
      drawingWgt: totals.drawingWgt + (row.drawingWgt || 0),
      processWgt: totals.processWgt + (row.processWgt || 0),
      noStrip: totals.noStrip + (row.noStrip || 0),
      proStack: totals.proStack + (row.proStack || 0),
      actualStrips: totals.actualStrips + (row.actualStrips || 0),
      actualWgt: totals.actualWgt + (row.actualWgt || 0),
      burr: totals.burr + (row.burr || 0)
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
                  <th colSpan="2">Observed</th>
                  <th>Burr L (micron)</th>
                  <th>Remark/Operator</th>
                </tr>
                <tr>
                  <th colSpan="10"></th>
                  <th>Length</th>
                  <th>Width</th>
                  <th colSpan="2"></th>
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
                      <input
                        type="number"
                        step="0.01"
                        value={row.proStack}
                        onChange={(e) => handleInputChange(index, 'proStack', e.target.value)}
                        className="form-input"
                      />
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
                      <input
                        type="number"
                        value={row.actualStrips}
                        onChange={(e) => handleInputChange(index, 'actualStrips', e.target.value)}
                        className="form-input"
                      />
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
                      <div className="input-with-smart-arrows">
                        <input
                          type="number"
                          step="0.01"
                          value={row.observedWidth}
                          onChange={(e) => handleInputChange(index, 'observedWidth', e.target.value)}
                          className="form-input"
                        />
                        <div className="smart-arrow-controls">
                          <button
                            type="button"
                            className="smart-arrow-btn up"
                            onClick={() => handleSmartArrowClick(index, 'up')}
                            title="Increase values and update related fields"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="smart-arrow-btn down"
                            onClick={() => handleSmartArrowClick(index, 'down')}
                            title="Decrease values and update related fields"
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
                        value={row.burr}
                        onChange={(e) => handleInputChange(index, 'burr', e.target.value)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.remark}
                        onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                        className="form-input"
                        placeholder="Remark/Operator"
                      />
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="totals-row">
                  <td colSpan="3"><strong>Total</strong></td>
                  <td><strong>{totals.drawingWgt.toFixed(2)}</strong></td>
                  <td><strong>{totals.processWgt.toFixed(2)}</strong></td>
                  <td><strong>{totals.noStrip.toFixed(3)}</strong></td>
                  <td><strong>{totals.proStack.toFixed(2)}</strong></td>
                  <td></td>
                  <td><strong>{totals.actualStrips}</strong></td>
                  <td><strong>{totals.actualWgt.toFixed(2)}</strong></td>
                  <td colSpan="5"></td>
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