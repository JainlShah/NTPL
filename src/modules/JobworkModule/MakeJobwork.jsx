import React, { useState } from 'react';

const MakeJobwork = () => {
  const [processType, setProcessType] = useState("");
  const [laminationType, setLaminationType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    natureOfJob: "overLap",
    jobType: "newJob",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {showForm ? "Make New Jobwork" : "Create New Jobwork"}
          </h1>
          <p className="text-gray-600 mt-2">
            {showForm 
              ? "*Indicates Compulsory Fields" 
              : "Select the process type to begin creating a new jobwork"
            }
          </p>
        </div>

        {!showForm ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Process Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={processType}
                  onChange={(e) => {
                    setProcessType(e.target.value);
                    setLaminationType(""); // Reset lamination type when process type changes
                  }}
                >
                  <option value="" className="text-gray-500">Select a process type</option>
                  {processOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-gray-700">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {processType === "lamination" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lamination Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={laminationType}
                    onChange={(e) => setLaminationType(e.target.value)}
                  >
                    <option value="" className="text-gray-500">Select lamination type</option>
                    {laminationOptions.map(option => (
                      <option key={option.value} value={option.value} className="text-gray-700">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  onClick={() => {
                    setProcessType("");
                    setLaminationType("");
                  }}
                >
                  Cancel
                </button>
                
                {canProceed() ? (
                  <button 
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                <span className="text-red-500">*</span> indicates required fields
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Drawing No.
                      </label>
                      <input
                        type="text"
                        value={formData.drawingNo}
                        onChange={(e) => handleInputChange("drawingNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Company Name
                      </label>
                      <select
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Company</option>
                        {companyOptions.map(option => (
                          <option key={option.value} value={option.value} className="text-gray-700">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Work Order No.
                      </label>
                      <input
                        type="text"
                        value={formData.workOrderNo}
                        onChange={(e) => handleInputChange("workOrderNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Material Thickness
                      </label>
                      <input
                        type="text"
                        value={formData.materialThickness}
                        onChange={(e) => handleInputChange("materialThickness", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *No Of Sets
                      </label>
                      <input
                        type="text"
                        value={formData.noOfSets}
                        onChange={(e) => handleInputChange("noOfSets", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *No Of Items[DOKE]
                      </label>
                      <input
                        type="text"
                        value={formData.noOfItems}
                        onChange={(e) => handleInputChange("noOfItems", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Density
                      </label>
                      <input
                        type="text"
                        value={formData.density}
                        onChange={(e) => handleInputChange("density", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Step Unit
                      </label>
                      <input
                        type="text"
                        value={formData.stepUnit}
                        onChange={(e) => handleInputChange("stepUnit", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Stacking Factor (In %)
                      </label>
                      <input
                        type="text"
                        value={formData.stackingFactor}
                        onChange={(e) => handleInputChange("stackingFactor", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        P.O. No.
                      </label>
                      <input
                        type="text"
                        value={formData.poNo}
                        onChange={(e) => handleInputChange("poNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        P.O. Date
                      </label>
                      <input
                        type="date"
                        value={formData.poDate}
                        onChange={(e) => handleInputChange("poDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material Grade
                      </label>
                      <input
                        type="text"
                        value={formData.materialGrade}
                        onChange={(e) => handleInputChange("materialGrade", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Work Order No.
                      </label>
                      <input
                        type="text"
                        value={formData.customerWorkOrderNo}
                        onChange={(e) => handleInputChange("customerWorkOrderNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Project Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerProjectName}
                        onChange={(e) => handleInputChange("customerProjectName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Indent No.
                      </label>
                      <input
                        type="text"
                        value={formData.customerIndentNo}
                        onChange={(e) => handleInputChange("customerIndentNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Item Code
                      </label>
                      <input
                        type="text"
                        value={formData.customerItemCode}
                        onChange={(e) => handleInputChange("customerItemCode", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Req Dispatch Date
                      </label>
                      <input
                        type="date"
                        value={formData.customerReqDispatchDate}
                        onChange={(e) => handleInputChange("customerReqDispatchDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sendToInProcessQc}
                      onChange={(e) => handleInputChange("sendToInProcessQc", e.target.checked)}
                      className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 font-medium">Send To In Process QC</span>
                  </label>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button 
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    className="px-8 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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