import React, { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import "../../styles/slitting.css";
import OperatorSlittingDetails from "./OperatorSlittingDetails";
import SlittingTable from "./SlittingTable";

const Operator = ({
  data,
  pagination,
  searchQuery,
  handleSearch,
  handleFilter,
  onCoilHold,
  onPartialCoilHold,
  onStatusChange,
  onGenerateQR,
  addedData,
  filter
}) => {
  const [isOperatorSlittingDetailsVisible, setOperatorSlittingDetailsVisible] =
    useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOperatorSlittingDetailsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    
  }, []);

  const [currRow, setCurrRow] = useState(null);
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

  useEffect(() => {
    console.log("addedData", addedData);
    if(addedData){
      setCurrRow(addedData);
      setOperatorSlittingDetailsVisible(true);
    }
  },[addedData]);
  
  const filterableColumns = ["coil_rollNumber", "width", "thickness", "weight"];
  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    setOperatorSlittingDetailsVisible(true);
    setCurrRow(row);
  };

  return (
    <>
      <div className="operator-container">
      <SlittingTable
          data={data}
          searchQuery={searchQuery}
          pagination={pagination}
          onSearchChange={handleSearch}
          onRowClick={handleRowClick}
          filter = {filter}
        />

        {isOperatorSlittingDetailsVisible && (
          <OperatorSlittingDetails
            title={"Slitting Program"}
            data={currRow}
            isViewOnly={true}
            onClose={() => setOperatorSlittingDetailsVisible(false)}
            onCoilHold={onCoilHold}
            onPartialCoilHold={onPartialCoilHold}
            onStatusChange={onStatusChange}
            onGenerateQR={onGenerateQR}
          />
        )}
      </div>
    </>
  );
};

export default Operator;
