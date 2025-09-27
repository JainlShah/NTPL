import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/genericTable.jsx";
import "../../styles/Slitting.css";
import useSlitting from "../../hooks/useSlitting.jsx";
import CommonError from "../../components/error/CommonError.jsx";
import animationData from "../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
import Supervisor from "./Supervisor.jsx";
import Operator from "./Operator.jsx";
import log from "../../components/logger.jsx";
import QRModelRolls from "../../model/QRModelRolls.jsx";
import QRScreenRolls from "../../components/QrCodeScreens/QrScreenRolls.jsx";
import { useSearchParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
//import { set } from "react-datepicker/dist/date_utils.js";

const Slitting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobNumber = searchParams.get("jobNumber");
  const rollNumber = searchParams.get("rollNumber");
  const coilNumber = searchParams.get("coilNumber");
  console.log("rollNumber:", rollNumber);
  console.log("jobNumber:", jobNumber);
  const location = useLocation();
  const shorlistedJobInfo = location.state || {};
  console.log("shorlisted data:", shorlistedJobInfo);

  const [activeTab, setActiveTab] = useState("Supervisor");
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [isQRScreenVisible, setQRScreenVisible] = useState(false);
  const [qrDetails, setQrDetails] = useState([]);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isRollList, setIsRollList] = useState(false);
  const [addedData, setAddedData] = useState(null);

  const onGenerateQrSuccess = (response) => {
    setAddedData(null);

    log.info("QR code generated successfully:", response);
    console.log("QR code :", response);

    if (!response || !response?.rollsData) {
      throw new Error("Invalid response structure. 'rollsData' not found.");
    }
    console.log(
      "QR code generated successfully======:",
      response.rollsData.map((roll) => roll) // Log each roll object for debugging
    );
    const qrList = response.rollsData.map((roll) => {
      const formattedDate = roll.createdAt
        ? (() => {
          const date = new Date(roll.createdAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
        : "N/A";

      const formattedJobNumber = roll.jobNumber
        ?.toUpperCase()
        .startsWith("EXTRA")
        ? "EXTRA"
        : roll.jobNumber || "N/A";

      return new QRModelRolls(
        response.slittingDetail?.coil_rollNumber,
        roll.rollNumber,
        roll.qrCodeNumber,
        formattedJobNumber,
        roll.drawingNumber,
        roll.width,
        roll.weight,
        roll.grade?.toUpperCase() || "N/A",
        roll.materialType?.toUpperCase() || "N/A",

        formattedDate, // Use the formatted date here
        roll.rollStatus
      );
    });

    const coilInfo = response?.coilData;

    if (coilInfo && coilInfo?.coilNumber) {
      const formattedDate = coilInfo.updatedAt
        ? (() => {
          const date = new Date(coilInfo.updatedAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
        : "N/A";

      const coilQRModel = new QRModelRolls(
        coilInfo.coilNumber,
        "NA",
        coilInfo.coilNumber,
        "NA",
        "NA",
        coilInfo.width,
        coilInfo.weight,
        coilInfo?.grade?.toUpperCase() || "N/A",
        coilInfo?.materialType?.toUpperCase() || "N/A",
        formattedDate,
        coilInfo?.status
      );

      qrList.push(coilQRModel);
    }

    setQrDetails(qrList);
    setQRScreenVisible(true);
  };
  const onAddSuccess = (data) => {
    console.log("add success", data);
    toast.success("Successfully added the slitting program.");
    setActiveTab("Operator");
    setAddedData(data);
  };

  const {
    loading,
    error,
    slittingList,
    pagination,
    addSlittingProgram,
    coilHold,
    partialCoilHold,
    generateQR,
    updateStatus,
    handleSlittingProgramDelete,
    updateSlitiingProgram,
    addMaximumStackSlittingProgram,
    availableFilters

  } = useSlitting(searchQuery, currPage, filters, onGenerateQrSuccess, onAddSuccess);

  useEffect(() => {
    if (
      shorlistedJobInfo.jobNumber !== null &&
      shorlistedJobInfo.jobNumber !== undefined
    ) {
      setActiveTab("Supervisor");
      setIsShortlisted(!!shorlistedJobInfo); // Set shortlisting based on jobNumber presence
      setIsRollList(!!rollNumber);
      setSearchQuery("");
      setCurrPage(1);
    }
    if (rollNumber !== null && rollNumber !== undefined) {
      setActiveTab("Supervisor");
      setSearchQuery("");
      setCurrPage(1);
    }
  }, [shorlistedJobInfo, rollNumber]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrPage(1);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleFilter = (filters) => {
    log.info("Filters applied:", filters);
    setFilters(filters);
    setCurrPage(1);
  };

  const handleAddSlittingProgram = (formData) => {
    log.info("Form data:", formData);
    addSlittingProgram(formData);
    handleBackClick(true);
  };

  const handleUpdateSlitiingProgram = (formData) => {
    log.info("Form data:", formData);
    updateSlitiingProgram(formData);
    handleBackClick(true);
  };

  const handleCoilHold = (holdData) => {
    coilHold(holdData);
  };

  const handlePartialCoilHold = (formData) => {
    partialCoilHold(formData);
  };

  const handleStatusChange = (formData) => {
    log.info("Status change:", JSON.stringify(formData));
    updateStatus(formData);
  };

  const handleQrCodeGeneration = (formData) => {
    console.log("formData");
    console.log(formData);
    log.info("Generating QR code for coil number:");
    setAddedData(null);
    generateQR(formData);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setQRScreenVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleBackClick = (isSubmit) => {
    setAddedData(null);
    // console.log("backclicked");
    // // Reset all relevant states
    // setActiveTab("Supervisor");
    // setSearchQuery("");
    // setCurrPage(1);
    // setFilters([]);
    // setQRScreenVisible(false);
    // setQrDetails([]);
    // setIsShortlisted(false);
    // setIsRollList(false);

    // Reset query parameters
    navigate({
      pathname: "/slitting",
      search: "",
    });
    // navigate(0);

    // if (!isSubmit) {
    //   if (rollNumber) {
    //     toast.error("Error while assigning the roll");
    //     navigate("/roll-inventory");
    //   } else if (coilNumber) {
    //     toast.error("Error while loading the coil");
    //     navigate("/coil-inventory");
    //   }
    // } else {
    //   navigate(-1);

    //   navigate("/slitting");
    // }
  };

  return (
    <>
      <div className="slitting-container">
        <h1>Slitting</h1>
        {loading && (
          <p style={{ textAlign: "center" }}>
            Hold on <br />
            while we are loading the data...
          </p>
        )}
        {error && <CommonError error={error} />}
        {!loading && !error && (
          <>
            <div className="slitting-tab-container">
              <span
                className={`tab ${activeTab === "Supervisor" ? "active" : ""}`}
                onClick={() => handleTabClick("Supervisor")}
              >
                Supervisor
              </span>
              <span
                className={`tab ${activeTab === "Operator" ? "active" : ""}`}
                onClick={() => handleTabClick("Operator")}
              >
                Operator
              </span>
            </div>
            <div className="slitting-body">
              {activeTab === "Supervisor" && (
                <Supervisor
                  loading={loading}
                  error={error}
                  data={slittingList}
                  pagination={pagination}
                  searchQuery={searchQuery}
                  handleSearch={handleSearch}
                  handleFilter={handleFilter}
                  handlePageChange={handlePageChange}
                  onAddClick={handleAddSlittingProgram}
                  onDelete={handleSlittingProgramDelete}
                  onUpdateSlittingProgram={handleUpdateSlitiingProgram}
                  shorlistedJobInfo={shorlistedJobInfo}
                  rollNumber={rollNumber}
                  addedCoil={coilNumber}
                  onBackClick={handleBackClick}
                  filter = {availableFilters}
                />
              )}
              {activeTab === "Operator" && (
                <Operator
                  loading={loading}
                  error={error}
                  data={slittingList}
                  pagination={pagination}
                  searchQuery={searchQuery}
                  handleSearch={handleSearch}
                  handleFilter={handleFilter}
                  handlePageChange={handlePageChange}
                  onCoilHold={handleCoilHold}
                  onPartialCoilHold={handlePartialCoilHold}
                  onStatusChange={handleStatusChange}
                  onGenerateQR={handleQrCodeGeneration}
                  addedData={addedData}
                  filter = {availableFilters}
                />
              )}
            </div>
          </>
        )}
        {loading && (
          <div className="loading-overlay">
            <div style={{ width: 300, height: 300 }}>
              <Player
                autoplay
                loop
                speed={2}
                src={animationData}
                style={{ width: "80%", height: "80%" }}
              />
            </div>
          </div>
        )}
        {isQRScreenVisible && (
          <div className="qr-overlay">
            <div className="qr-modal">
              <QRScreenRolls
                value={qrDetails}
                onClose={() => {
                  setQRScreenVisible(false);
                  addMaximumStackSlittingProgram();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Slitting;
