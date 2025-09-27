import React, { useState, useEffect } from "react";
import log from "../../../components/logger";
import useScrap from "../../../hooks/useScrap";
import GenericTable from "../../../components/genericTable";
import CommonError from "../../../components/error/CommonError";

const ScrapByRoll = ({ }) => {

    const [selectedRow, setSelectedRow] = useState(null);
    const [actualWeight, setActualWeightMoved] = useState(""); // For "Actual Weight Moved
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currPage, setCurrPage] = useState(1);
    const [filters, setFilters] = useState([]);

    const { loading, error, scrapList, moveScrap, pagination, handleExport, availableFilters } =
        useScrap(searchQuery, currPage, filters,"rolls");

    // Handle Escape key to close popups
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setDetailsVisible(false);
                setPopupVisible(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Log pagination changes
    useEffect(() => {
        log.info("Scrap list pagination:", scrapList);
    }, [scrapList]);

    // Table columns
    const columns = [
        { label: "Thickness", accessor: "thickness" },
        {
            label: "Scrap Type",
            accessor: "scrapType",
            render: (value) =>
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        },
        { label: "Weight", accessor: "weight" },
        {
            label: "Date",
            accessor: "createdAt",
            render: (value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
            },
        },
    ];

    // Filterable columns
    const filterableColumns = ["thickness", "scrapType", "weight", "createdAt"];

    // Handle row click
    const handleRowClick = (row) => {
        log.info("Row clicked:", row);
        setSelectedRow(row);
        setActualWeightMoved(""); // Reset actual weight
        setPopupVisible(true);
    };

    const handleFormSubmit = (formData) => {
        const actualWeightMoved = formData.get("actualWeightMoved");
        const selectedWeight = selectedRow.weight;

        // Validate input before submission
        if (parseFloat(actualWeightMoved) > parseFloat(selectedWeight)) {
            toast.error(
                "Actual weight moved cannot be greater than the total scrap weight."
            );
            return;
        }

        // If validation passes, proceed with the form submission
        handleMove(formData);
    };

    // Handle move scrap
    const handleMove = (formData) => {
        log.info(`Actual Weight Moved: ${actualWeight}`);
        setPopupVisible(true);
    };

    // Handle popup close
    const handlePopupClose = () => {
        setPopupVisible(false);
    };

    // Handle button click in popup
    const handleButtonClick = (buttonName) => {
        log.info(`${buttonName} clicked.`);
        
        handlePopupClose();
        const transferData = {
            scrapId: selectedRow.scrapId,
            rollId: selectedRow.rollId,
            moveTo: buttonName,
            actualWeight:0
        };
        moveScrap(transferData);
    };

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrPage(page);
    };

    // Handle filters
    const handleFilter = (filters) => {
        log.info("Filters applied:", filters);
        setFilters(filters);
        setCurrPage(1);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }
    return (

        <>
            <div className="scrap-roll-container">

                <div className="scrap-container">
                    {error != null ? (
                        <CommonError error={error} />
                    ) : (
                        <GenericTable
                            columns={columns}
                            loading={loading}
                            data={scrapList}
                            onRowClick={handleRowClick}
                            enableSearch={true}
                            onPageChange={handlePageChange}
                            onSearchChange={handleSearch}
                            pagination={pagination}
                            enableFilter={true}
                            filter={availableFilters}
                            onFilter={handleFilter}
                            filterableColumns={filterableColumns}
                        />
                    )}
                </div>

            </div>

            {isPopupVisible && (
                <div className="button-popup-overlay">
                    <div className="button-popup-container">
                        <button
                            className="popup-button"
                            onClick={() => handleButtonClick("dispatch")}
                        >
                            Dispatch
                        </button>
                        <button
                            className="popup-button"
                            onClick={() => handleButtonClick("scrapyard")}
                        >
                            Scrap Yard
                        </button>
                        <button
                            className="popup-button"
                            onClick={() => handleButtonClick("roll")}
                        >
                           Roll Inventory
                        </button>
                        <button className="popup-close" onClick={handlePopupClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>

    );


}

export default ScrapByRoll;