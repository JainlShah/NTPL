import React, { useState, useEffect } from 'react';

const OverLapForm = ({ formData, onBack, onSubmit }) => {
  const [materialUnits, setMaterialUnits] = useState({
    reqOuterWeight: '161.02',
    reqCenterWeight: '70.24',
    reqYokeWeight: '169.37',
    reqCoreWeight: '419.63'
  });

  const [plateDetails, setPlateDetails] = useState({
    outer: [],
    center: [],
    yoke: []
  });

  const [holeUnits, setHoleUnits] = useState({
    outer: { holes: '0', diameterInMm: '0' },
    center: { holes: '0', diameterInMm: '0' },
    yoke: { holes: '0', diameterInMm: '0' }
  });

  // Initialize plate details based on number of items
  useEffect(() => {
    const noOfItems = parseInt(formData.noOfItems) || 11;
    
    const initializePlateData = () => {
      return Array.from({ length: noOfItems }, (_, index) => ({
        no: index + 1,
        pLength: '',
        qWidth: '',
        weightKg: ''
      }));
    };

    setPlateDetails({
      outer: initializePlateData(),
      center: initializePlateData(),
      yoke: initializePlateData()
    });
  }, [formData.noOfItems]);

  const handleMaterialUnitsChange = (field, value) => {
    setMaterialUnits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlateDetailsChange = (section, index, field, value) => {
    setPlateDetails(prev => ({
      ...prev,
      [section]: prev[section].map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const handleHoleUnitsChange = (section, field, value) => {
    setHoleUnits(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      materialUnits,
      plateDetails,
      holeUnits
    };
    onSubmit(submitData);
  };

  const renderPlateTable = (title, section, data) => (
    <div style={{ flex: 1, minWidth: '300px' }}>
      <h4 style={{ 
        backgroundColor: '#6b7280', 
        color: 'white', 
        padding: '0.5rem', 
        margin: '0',
        textAlign: 'center',
        fontSize: '0.875rem',
        fontWeight: 'bold'
      }}>
        {title}
      </h4>
      
      <div style={{ 
        border: '1px solid #d1d5db',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                No
              </th>
              <th style={{ 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                P (Length)
              </th>
              <th style={{ 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                Q (Width)
              </th>
              <th style={{ 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                Weight Kg.
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td style={{ 
                  padding: '0.25rem', 
                  border: '1px solid #d1d5db',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.75rem'
                }}>
                  {row.no}
                </td>
                <td style={{ 
                  padding: '0.25rem', 
                  border: '1px solid #d1d5db' 
                }}>
                  <input
                    type="text"
                    value={row.pLength}
                    onChange={(e) => handlePlateDetailsChange(section, index, 'pLength', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.25rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.75rem',
                      color: '#374151'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '0.25rem', 
                  border: '1px solid #d1d5db' 
                }}>
                  <input
                    type="text"
                    value={row.qWidth}
                    onChange={(e) => handlePlateDetailsChange(section, index, 'qWidth', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.25rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.75rem',
                      color: '#374151'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '0.25rem', 
                  border: '1px solid #d1d5db' 
                }}>
                  <input
                    type="text"
                    value={row.weightKg}
                    onChange={(e) => handlePlateDetailsChange(section, index, 'weightKg', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.25rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.75rem',
                      color: '#374151'
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hole Units for this section */}
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderTop: 'none'
      }}>
        <h5 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151'
        }}>
          Hole Units for {title}
        </h5>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.5rem' 
        }}>
          <div>
            <label style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Holes
            </label>
            <input
              type="text"
              value={holeUnits[section].holes}
              onChange={(e) => handleHoleUnitsChange(section, 'holes', e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '3px',
                fontSize: '0.75rem',
                outline: 'none',
                color: '#374151'
              }}
            />
          </div>
          <div>
            <label style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Diameter in mm
            </label>
            <input
              type="text"
              value={holeUnits[section].diameterInMm}
              onChange={(e) => handleHoleUnitsChange(section, 'diameterInMm', e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '3px',
                fontSize: '0.75rem',
                outline: 'none',
                color: '#374151'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '2rem 0' 
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          border: '1px solid #e5e7eb', 
          padding: '2rem' 
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#1f2937',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Material Units
          </h2>

          {/* Material Units Section */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#f9fafb'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.25rem' 
              }}>
                REQ. OUTER WEIGHT
              </label>
              <input
                type="text"
                value={materialUnits.reqOuterWeight}
                onChange={(e) => handleMaterialUnitsChange('reqOuterWeight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.25rem' 
              }}>
                REQ. CENTER WEIGHT
              </label>
              <input
                type="text"
                value={materialUnits.reqCenterWeight}
                onChange={(e) => handleMaterialUnitsChange('reqCenterWeight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.25rem' 
              }}>
                REQ. YOKE WEIGHT
              </label>
              <input
                type="text"
                value={materialUnits.reqYokeWeight}
                onChange={(e) => handleMaterialUnitsChange('reqYokeWeight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.25rem' 
              }}>
                REQ. CORE WEIGHT
              </label>
              <input
                type="text"
                value={materialUnits.reqCoreWeight}
                onChange={(e) => handleMaterialUnitsChange('reqCoreWeight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>
          </div>

          {/* Three Plate Details Tables */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {renderPlateTable('Outer Limb Plate Details', 'outer', plateDetails.outer)}
            {renderPlateTable('Center Limb Plate Details', 'center', plateDetails.center)}
            {renderPlateTable('Yoke Plate Details', 'yoke', plateDetails.yoke)}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button 
              type="button"
              style={{
                padding: '0.75rem 2rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              onClick={onBack}
            >
              Back
            </button>
            
            <button 
              type="button"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              onClick={handleSubmit}
            >
              Submit Units
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverLapForm;