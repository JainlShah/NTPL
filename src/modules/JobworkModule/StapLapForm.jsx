import React, { useState, useEffect } from 'react';

const StapLapForm = ({ formData, onBack, onSubmit }) => {
  const [materialUnits, setMaterialUnits] = useState({
    coreDia: '283',
    windowHeight: '575',
    legCenter: '550',
    noOfLaminationPacket: '5',
    reqOuterWeight: '',
    reqCenterWeight: '',
    reqYokeWeight: '',
    reqCoreWeight: '2408.08'
  });

  const [yokePlateDetails, setYokePlateDetails] = useState([]);
  const [holeDetails, setHoleDetails] = useState({
    outer: { noOfHole: '0', diameterInMm: '0' },
    center: { noOfHole: '0', diameterInMm: '0' },
    yoke: { noOfHole: '0', diameterInMm: '0' }
  });

  // Initialize yoke plate details based on number of items
  useEffect(() => {
    const noOfItems = parseInt(formData.noOfItems) || 11;
    const initialRows = Array.from({ length: noOfItems }, (_, index) => ({
      no: index + 1,
      qWidth: '',
      stack: ''
    }));
    setYokePlateDetails(initialRows);
  }, [formData.noOfItems]);

  const handleMaterialUnitsChange = (field, value) => {
    setMaterialUnits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleYokePlateChange = (index, field, value) => {
    setYokePlateDetails(prev => 
      prev.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleHoleDetailsChange = (section, field, value) => {
    setHoleDetails(prev => ({
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
      yokePlateDetails,
      holeDetails
    };
    onSubmit(submitData);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '2rem 0' 
    }}>
      <div style={{ 
        maxWidth: '1000px', 
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
                CORE DIA
              </label>
              <input
                type="text"
                value={materialUnits.coreDia}
                onChange={(e) => handleMaterialUnitsChange('coreDia', e.target.value)}
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
                WINDOW HEIGHT
              </label>
              <input
                type="text"
                value={materialUnits.windowHeight}
                onChange={(e) => handleMaterialUnitsChange('windowHeight', e.target.value)}
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
                LEG CENTER
              </label>
              <input
                type="text"
                value={materialUnits.legCenter}
                onChange={(e) => handleMaterialUnitsChange('legCenter', e.target.value)}
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
                No. OF LAMINATION/PACKET
              </label>
              <input
                type="text"
                value={materialUnits.noOfLaminationPacket}
                onChange={(e) => handleMaterialUnitsChange('noOfLaminationPacket', e.target.value)}
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

          {/* Yoke Plate Details Table */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '0.75rem', 
              margin: '0 0 1rem 0',
              textAlign: 'center',
              borderRadius: '4px 4px 0 0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Yoke Plate Details
            </h3>
            
            <div style={{ 
              border: '1px solid #d1d5db',
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse' 
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      No
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      Q (Width)
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      Stack
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {yokePlateDetails.map((row, index) => (
                    <tr key={index}>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db',
                        textAlign: 'center',
                        backgroundColor: '#f9fafb'
                      }}>
                        {row.no}
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="text"
                          value={row.qWidth}
                          onChange={(e) => handleYokePlateChange(index, 'qWidth', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.25rem',
                            border: 'none',
                            outline: 'none',
                            color: '#374151'
                          }}
                        />
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="text"
                          value={row.stack}
                          onChange={(e) => handleYokePlateChange(index, 'stack', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.25rem',
                            border: 'none',
                            outline: 'none',
                            color: '#374151'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hole Details Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '0.75rem', 
              margin: '0 0 1rem 0',
              textAlign: 'center',
              borderRadius: '4px 4px 0 0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Hole Details
            </h3>
            
            <div style={{ 
              border: '1px solid #d1d5db',
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse' 
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}></th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      Outer
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      Center
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      Yoke
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      backgroundColor: '#f9fafb'
                    }}>
                      No of Hole
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.outer.noOfHole}
                        onChange={(e) => handleHoleDetailsChange('outer', 'noOfHole', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.center.noOfHole}
                        onChange={(e) => handleHoleDetailsChange('center', 'noOfHole', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.yoke.noOfHole}
                        onChange={(e) => handleHoleDetailsChange('yoke', 'noOfHole', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      backgroundColor: '#f9fafb'
                    }}>
                      Diameter in mm
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.outer.diameterInMm}
                        onChange={(e) => handleHoleDetailsChange('outer', 'diameterInMm', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.center.diameterInMm}
                        onChange={(e) => handleHoleDetailsChange('center', 'diameterInMm', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db' 
                    }}>
                      <input
                        type="text"
                        value={holeDetails.yoke.diameterInMm}
                        onChange={(e) => handleHoleDetailsChange('yoke', 'diameterInMm', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: 'none',
                          outline: 'none',
                          color: '#374151'
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StapLapForm;