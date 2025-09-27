import React, { useState } from 'react';

const MakeJobwork = () => {
  const [processType, setProcessType] = useState("");
  const [laminationType, setLaminationType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    drawingNo: "ET-2126X (C-5958)",
    stackingFactor: "97",
    companyName: "",
    poNo: "",
    workOrderNo: "WO/01/08/12366",
    poDate: "",
    materialThickness: "0.295",
    materialGrade: "30CG120",
    noOfSets: "1",
    customerWorkOrderNo: "",
    noOfItems: "11",
    customerProjectName: "",
    density: "7.65",
    customerIndentNo: "",
    stepUnit: "",
    customerItemCode: "",
    customerReqDispatchDate: "",
    sendToInProcessQc: true
  });

  const processOptions = [
    { value: "lamination", label: "Lamination" },
    { value: "reactor", label: "Reactor" },
    { value: "patta", label: "Patta Line" }
  ];

  const laminationOptions = [
    { value: "stapLap", label: "Stap Lap" },
    { value: "overLap", label: "Over Lap" }
  ];

  const companyOptions = [
    { value: "sibu", label: "SIBU" },
    { value: "newton", label: "Newton" },
    { value: "other", label: "Other" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const canProceed = () => {
    if (processType === "lamination") {
      return laminationType !== "";
    }
    return processType === "reactor" || processType === "patta";
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            {showForm ? "Make New Jobwork" : "Create New Jobwork"}
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            {showForm 
              ? "*Indicates Compulsory Fields" 
              : "Select the process type to begin creating a new jobwork"
            }
          </p>
        </div>

        {!showForm ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              border: '1px solid #e5e7eb', 
              padding: '2rem' 
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Process Type <span className="text-red-500">*</span>
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  value={processType}
                  onChange={(e) => {
                    setProcessType(e.target.value);
                    setLaminationType(""); // Reset lamination type when process type changes
                  }}
                >
                  <option value="">Select a process type</option>
                  {processOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {processType === "lamination" && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    Lamination Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    value={laminationType}
                    onChange={(e) => setLaminationType(e.target.value)}
                  >
                    <option value="">Select lamination type</option>
                    {laminationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '0.75rem', 
                marginTop: '2rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid #e5e7eb' 
              }}>
                <button 
                  style={{
                    padding: '0.5rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: '#374151',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setProcessType("");
                    setLaminationType("");
                  }}
                >
                  Cancel
                </button>
                
                {canProceed() ? (
                  <button 
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <span className="text-red-500">*</span> indicates required fields
              </p>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                border: '1px solid #e5e7eb', 
                padding: '2rem' 
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '2rem' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.25rem' 
                      }}>
                        *Drawing No.
                      </label>
                      <input
                        type="text"
                        value={formData.drawingNo}
                        onChange={(e) => handleInputChange("drawingNo", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
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
                        *Company Name
                      </label>
                      <select
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Company</option>
                        {companyOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.25rem' 
                      }}>
                        *Work Order No.
                      </label>
                      <input
                        type="text"
                        value={formData.workOrderNo}
                        onChange={(e) => handleInputChange("workOrderNo", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        *Material Thickness
                      </label>
                      <input
                        type="text"
                        value={formData.materialThickness}
                        onChange={(e) => handleInputChange("materialThickness", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        *No Of Sets
                      </label>
                      <input
                        type="text"
                        value={formData.noOfSets}
                        onChange={(e) => handleInputChange("noOfSets", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        *No Of Items[DOKE]
                      </label>
                      <input
                        type="text"
                        value={formData.noOfItems}
                        onChange={(e) => handleInputChange("noOfItems", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        *Density
                      </label>
                      <input
                        type="text"
                        value={formData.density}
                        onChange={(e) => handleInputChange("density", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        *Step Unit
                      </label>
                      <input
                        type="text"
                        value={formData.stepUnit}
                        onChange={(e) => handleInputChange("stepUnit", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.25rem' 
                      }}>
                        *Stacking Factor (In %)
                      </label>
                      <input
                        type="text"
                        value={formData.stackingFactor}
                        onChange={(e) => handleInputChange("stackingFactor", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        P.O. No.
                      </label>
                      <input
                        type="text"
                        value={formData.poNo}
                        onChange={(e) => handleInputChange("poNo", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        P.O. Date
                      </label>
                      <input
                        type="date"
                        value={formData.poDate}
                        onChange={(e) => handleInputChange("poDate", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Material Grade
                      </label>
                      <input
                        type="text"
                        value={formData.materialGrade}
                        onChange={(e) => handleInputChange("materialGrade", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Customer Work Order No.
                      </label>
                      <input
                        type="text"
                        value={formData.customerWorkOrderNo}
                        onChange={(e) => handleInputChange("customerWorkOrderNo", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Customer Project Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerProjectName}
                        onChange={(e) => handleInputChange("customerProjectName", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Customer Indent No.
                      </label>
                      <input
                        type="text"
                        value={formData.customerIndentNo}
                        onChange={(e) => handleInputChange("customerIndentNo", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Customer Item Code
                      </label>
                      <input
                        type="text"
                        value={formData.customerItemCode}
                        onChange={(e) => handleInputChange("customerItemCode", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
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
                        Customer Req Dispatch Date
                      </label>
                      <input
                        type="date"
                        value={formData.customerReqDispatchDate}
                        onChange={(e) => handleInputChange("customerReqDispatchDate", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1rem', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px' 
                }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={formData.sendToInProcessQc}
                      onChange={(e) => handleInputChange("sendToInProcessQc", e.target.checked)}
                      style={{ 
                        marginRight: '0.75rem', 
                        height: '1.25rem', 
                        width: '1.25rem' 
                      }}
                    />
                    <span style={{ color: '#374151', fontWeight: '500' }}>Send To In Process QC</span>
                  </label>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '2rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid #e5e7eb' 
                }}>
                  <button 
                    type="button"
                    style={{
                      padding: '0.5rem 1.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      color: '#374151',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    style={{
                      padding: '0.5rem 2rem',
                      backgroundColor: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeJobwork;