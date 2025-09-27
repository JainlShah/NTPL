import React, { useState } from 'react';

const MakeJobwork = () => {
  const [processType, setProcessType] = useState("");
  const [laminationType, setLaminationType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    natureOfJob: "overLap",
    jobType: "newJob",
    drawingNo: "E1.315X (C-5555)",
    stackingFactor: "97",
    companyName: "",
    poNo: "",
    workOrderNo: "",
    poDate: "",
    materialThickness: "0.255",
    materialGrade: "",
    noOfSets: "1",
    customerWorkOrderNo: "",
    noOfItems: "11",
    customerProjectName: "",
    density: "7.65",
    customerIndentNo: "",
    stepUnit: "",
    customerItemCode: "",
    customerReqDispatchDate: "",
    sendToInProcessQc: false
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main Content Area */}
      <div className="container mx-auto px-4">
        {/* Page Header */}
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
          /* Process Selection Screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {/* Process Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Process Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                >
                  <option value="" className="text-gray-500">Select a process type</option>
                  {processOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-gray-700">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lamination Configuration */}
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

              {/* Action Buttons */}
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
                
                {(processType === "lamination" && laminationType) || 
                 (processType === "reactor" || processType === "patta") ? (
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

            {/* Help Text */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                <span className="text-red-500">*</span> indicates required fields
              </p>
            </div>
          </div>
        ) : (
          /* Jobwork Form */
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Nature of Job and Job Type */}
                <div className="mb-8 p-4 bg-blue-50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nature of Job */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        *Nature of Job
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="natureOfJob"
                            value="stapLap"
                            checked={formData.natureOfJob === "stapLap"}
                            onChange={(e) => handleInputChange("natureOfJob", e.target.value)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Stap Lap</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="natureOfJob"
                            value="overLap"
                            checked={formData.natureOfJob === "overLap"}
                            onChange={(e) => handleInputChange("natureOfJob", e.target.value)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Over Lap</span>
                        </label>
                      </div>
                    </div>

                    {/* Select Job Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        *Select Job Type
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="jobType"
                            value="newJob"
                            checked={formData.jobType === "newJob"}
                            onChange={(e) => handleInputChange("jobType", e.target.value)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">New Job</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="jobType"
                            value="referenceJob"
                            checked={formData.jobType === "referenceJob"}
                            onChange={(e) => handleInputChange("jobType", e.target.value)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Reference Job</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Drawing No */}
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

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Company Name
                      </label>
                      <select
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" className="text-gray-500">Select Company</option>
                        {companyOptions.map(option => (
                          <option key={option.value} value={option.value} className="text-gray-700">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Work Order No */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        *Work Order No.
                      </label>
                      <input
                        type="text"
                        value={formData.workOrderNo}
                        onChange={(e) => handleInputChange("workOrderNo", e.target.value)}
                        placeholder="WO/01/08/12366"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Material Thickness */}
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

                    {/* No Of Sets */}
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

                    {/* No Of Items[DOKE] */}
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

                    {/* Density */}
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

                    {/* Step Unit */}
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

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Stacking Factor */}
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

                    {/* P.O. No */}
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

                    {/* P.O. Date */}
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

                    {/* Material Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material Grade
                      </label>
                      <input
                        type="text"
                        value={formData.materialGrade}
                        onChange={(e) => handleInputChange("materialGrade", e.target.value)}
                        placeholder="30CG120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Customer Work Order No */}
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

                    {/* Customer Project Name */}
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

                    {/* Customer Indent No */}
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

                    {/* Customer Item Code */}
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

                    {/* Customer Req Dispatch Date */}
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

                {/* Checkbox */}
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

                {/* Action Buttons */}
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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