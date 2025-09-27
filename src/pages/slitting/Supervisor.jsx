import React, { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import "../../styles/Slitting.css";
import SlittingForm from "./Slitting-Form.jsx";
import SlittingTable from "./SlittingTable.jsx";
import { useRowLock } from "../../hooks/useRowLock.jsx";
const Supervisor = ({
  loading,
  error,
  data,
  pagination,
  searchQuery,
  handleSearch,
  handleFilter,
  onAddClick,
  onDelete,
  onUpdateSlittingProgram,
  handlePageChange,
  shorlistedJobInfo,
  rollNumber,
  addedCoil,
  onBackClick,
  filter
}) => {
  const [isAddSlittingProgramVisivle, setIsAddSlittingProgramVisivle] =
    useState(false);
  const [isSlittingProgramDetailsVisivle, setIsSlittingProgramDetailsVisivle] =
    useState(false);
  const [currRow, setCurrRow] = useState(null);

  const { unlockRow } = useRowLock();

  useEffect(() => {
    if (
      shorlistedJobInfo.jobNumber !== null &&
      shorlistedJobInfo.jobNumber !== undefined
    ) {
      console.log(`Shortlisted job number: ${shorlistedJobInfo}`);
      // Perform actions based on the shortlisted job
      setIsAddSlittingProgramVisivle(true);
    }

    if (addedCoil) {
      console.log(`Added coil: ${addedCoil}`);
      // Perform actions based on the shortlisted job
      setIsAddSlittingProgramVisivle(true);
    }
    if (rollNumber !== null && rollNumber !== undefined) {
      setIsAddSlittingProgramVisivle(true);
      console.log(`Roll number: ${rollNumber}`);
    }
  }, [shorlistedJobInfo, rollNumber, addedCoil]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        unlockRow(addedCoil, "editing")
        setIsAddSlittingProgramVisivle(false);
        setIsSlittingProgramDetailsVisivle(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const columns = [
    {
      label: "Coil No.",
      accessor: "coil_rollNumber",
    },
    {
      label: "Width (mm)",
      accessor: "width",
    },
    {
      label: "Thickness (mm)",
      accessor: "thickness",
    },
    {
      label: "Weight (kg)",
      accessor: "weight",
    },
  ];
  const filterableColumns = ["coil_rollNumber", "width", "thickness", "weight"];

  const handleAddClick = () => {
    setIsAddSlittingProgramVisivle(true);
  };

  const handleAddSlittingProgramSubmit = (formData) => {
    setIsAddSlittingProgramVisivle(false);
    console.log("Slitting add Form submitted:", formData);
    onAddClick(formData);
  };
  const handleUpdateSlittingProgramSubmit = (formData) => {
    setIsSlittingProgramDetailsVisivle(false);
    const updatedData = { ...currRow, ...formData };
    updatedData.updatedBy = "Supervisor";
    console.log("Slitting Form update submitted:", updatedData);
    onUpdateSlittingProgram(updatedData);
  };

  const handleRowClick = (row) => {
    setCurrRow(row);
    console.log("Row clicked:", row);
    setIsSlittingProgramDetailsVisivle(true);
  };
  const handleDelete = (id) => {
    setIsAddSlittingProgramVisivle(false);
    onDelete(id);
  };
  const pageChange = (page) => {
    handlePageChange(page);
  };

  return (
    <>
      <div className="supervisor-container">
        <SlittingTable
          data={data}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          onRowClick={handleRowClick}
          onAddClick={handleAddClick}
          isAddEnable={true}
          onApplyFilters={handleFilter}
          filter={filter}
        />

        {isAddSlittingProgramVisivle && (
          <SlittingForm
            data={currRow}
            onCloseCllick={() => setIsAddSlittingProgramVisivle(false)}
            title={"Add Slitting Program"}
            onSubmit={(formData) => {
              unlockRow(addedCoil, "editing");
              handleAddSlittingProgramSubmit(formData);
            }}
            onClose={() => {
              unlockRow(addedCoil, "editing");
              setIsAddSlittingProgramVisivle(false);
              if (addedCoil) {
                console.log("backkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
                onBackClick();
              } else {
                onBackClick();
              }
            }}
            shorlistedJobInfo={shorlistedJobInfo}
            addedCoil={addedCoil}
            rollNumber={rollNumber}
          />
        )}

        {isSlittingProgramDetailsVisivle && (
          <SlittingForm
            data={currRow}
            onCloseCllick={() => setIsSlittingProgramDetailsVisivle(false)}
            title={"Slitting Program Details"}
            onSubmit={handleUpdateSlittingProgramSubmit}
            onClose={() => {
              setIsSlittingProgramDetailsVisivle(false);
              setCurrRow(null);
            }}
            isViewOnly={true}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default Supervisor;
