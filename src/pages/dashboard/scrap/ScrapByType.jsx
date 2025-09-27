import React, { useState } from "react";
import ScrapByThickness from "./ScrapByThickness";
import useScrap from "../../../hooks/useScrap";
import animationData from "../../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
const ScrapByType = () => {
    const [selectedScrapType, setSelectedScrapType] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currPage, setCurrPage] = useState(1);
    const [filters, setFilters] = useState([]);

    const {
        loading,
        error,
        scrapList,
        moveScrap,
        pagination,
        handleExport,
        availableFilters,
    } = useScrap(searchQuery, currPage, filters, "scrapType");

    const handleScrapTypeChange = (type) => {
        // Check if the selected scrap type exists in the scrapList
        const selectedScrap = scrapList.find((scrap) => scrap.scrapType === type);
        if (selectedScrap) {
            setSelectedScrapType(type);
        } else {
            console.error("Selected scrap type not found.");
        }
    };

    const handleBackClick = () => {
        setSelectedScrapType(null);
    };

    // Filter scrapList to get data for the selected scrap type
    const selectedScrapData = selectedScrapType
        ? scrapList
            .find((scrap) => scrap.scrapType === selectedScrapType)
            ?.items.reduce((acc, item) => {
                const existing = acc.find((i) => i.thickness === item.thickness);
                if (existing) {
                    existing.weight += item.weight;
                } else {
                    acc.push({ ...item });
                }
                return acc;
            }, []) || []
        : [];

    return (
        <div className="scrapType-container">

            {!loading && !error && (
                <>
                    {!selectedScrapType ? (
                        <>
                            <div className="scrapType-body-container">
                                <div className="body-row">
                                    {scrapList.map((scrap, index) => (
                                        <div
                                            className={`scrap-card ${scrap.totalWeight === 0 ? 'disabled' : ''}`}
                                            key={index}
                                            onClick={() => scrap.totalWeight !== 0 && handleScrapTypeChange(scrap.scrapType)}
                                        >
                                            <h3>{scrap.scrapType}</h3>
                                            <p>Total: {scrap.totalWeight} kg</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <ScrapByThickness
                            data={selectedScrapData} // Pass filtered data
                            scrapType={selectedScrapType}
                            backClick={handleBackClick}
                            onSubmit={(transferData) => {
                                console.log(transferData);
                                moveScrap(transferData)
                                // Call moveScrap or other functions here
                            }}
                        />
                    )}
                </>
            )}
            {loading && (
                <>
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
                    </div></>
            )}
        </div>
    );
};

export default ScrapByType;