import React, { useState, useEffect} from 'react';

const PattaLineForm = ({ formData, onBack, onSubmit }) => {
  const [pattaLineData, setPattaLineData] = useState([
    
  ]);
 useEffect(() => {
    const noOfItems = parseInt(formData.noOfItems) || 11;
    const initialRows = Array.from({ length: noOfItems }, (_, index) => (
      {
      no: index+ 1,
      noOfSets: '',
      length: '',
      width: '',
      stack: ''
    }
    ));
    setPattaLineData(initialRows);
  }, [formData.noOfItems]);
  const handlePattaLineChange = (index, field, value) => {
    setPattaLineData(prev => 
      prev.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    setPattaLineData(prev => [
      ...prev,
      {
        no: prev.length + 1,
        noOfSets: '',
        length: '',
        width: '',
        stack: ''
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (pattaLineData.length > 1) {
      setPattaLineData(prev => 
        prev.filter((_, i) => i !== index)
          .map((row, i) => ({ ...row, no: i + 1 }))
      );
    }
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      pattaLineData
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
            Patta Line Details
          </h2>

          {/* Patta Line Table */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse' 
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#6b7280' }}>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      No
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      No of Sets
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      Length
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      Width
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      Stack
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {pattaLineData.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db',
                        textAlign: 'center',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {row.no}
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="number"
                          value={row.noOfSets}
                          onChange={(e) => handlePattaLineChange(index, 'noOfSets', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            color: '#374151'
                          }}
                          placeholder="Enter sets"
                        />
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="number"
                          value={row.length}
                          onChange={(e) => handlePattaLineChange(index, 'length', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            color: '#374151'
                          }}
                          placeholder="Enter length"
                        />
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="number"
                          value={row.width}
                          onChange={(e) => handlePattaLineChange(index, 'width', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            color: '#374151'
                          }}
                          placeholder="Enter width"
                        />
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db' 
                      }}>
                        <input
                          type="number"
                          value={row.stack}
                          onChange={(e) => handlePattaLineChange(index, 'stack', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            color: '#374151'
                          }}
                          placeholder="Enter stack"
                        />
                      </td>
                    
                    </tr>
                  ))}
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

export default PattaLineForm;