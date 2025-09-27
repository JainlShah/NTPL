import { React, useEffect, useState } from "react";
import GenericForm from "../../../components/generic/GenericForm";
import { toast } from "react-hot-toast";
import useScrap from "../../../hooks/useScrap";
import animationData from "../../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
const ScrapByThickness = ({ data, scrapType = null, backClick, onSubmit }) => {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [actualWeight, setActualWeightMoved] = useState(""); // For "Actual Weight Moved"
    const [formData, setFormData] = useState(null); // State to store form data

    useEffect(() => {
        console.log("data", data);
    })
    const { loading, error, scrapList, moveScrap, pagination, handleExport, availableFilters } =
        useScrap("", "", "", "thickness");

    const handleDateChange = (date) => {
        console.log(date);
    }

    const handleBackClick = () => {
        console.log("back click");
        backClick();
    }

    const handleCardSelection = (card) => {
        setDetailsVisible(true);
        setSelectedCard(card);
    }

    const handlePopupClose = () => {
        setPopupVisible(false);
    }

    const handleButtonClick = (action) => {
        console.log(action);
        let data = null;
        if (formData) {
            const jsonData = {};
            for (let pair of formData.entries()) {
                jsonData[pair[0]] = pair[1] instanceof File ? pair[1].name : pair[1];
            }
            jsonData.scrapStatus = action;
            console.log("Form Data JSON:", JSON.stringify(jsonData, null, 2));
            data = jsonData;
        }

        handlePopupClose();
        const transferData = {
            scrapId: selectedCard.scrapId,
            rollId:null,
            moveTo: data.scrapStatus,
            actualWeight: Number(data.actualWeightMoved),
        };
        console.log(transferData);
        setPopupVisible(false);
        onSubmit(transferData);
        backClick();
    }

    // Determine which data to use
    const displayData = data || scrapList;

    return (
        <>
            <div className="thickness-container">
                {scrapType && <i className="fas fa-arrow-left" onClick={() => handleBackClick()} style={{ cursor: "pointer" }}></i>}
                {/* <input type="date" onChange={(e) => handleDateChange(e.target.value)} /> */}
                <div className="body-row">
                    {displayData?.map((item, index) => (
                        <div
                            key={index}
                            className="scrap-card"
                            onClick={() => {
                                if (scrapType) {
                                    handleCardSelection({
                                        thickness: item.thickness,
                                        scrapType: scrapType,
                                        weight: item.weight,
                                        scrapId: item.scrapId,
                                    });
                                }
                            }}
                            style={scrapType ? {} : { pointerEvents: "none", opacity: "1" }}
                        >
                            <h3>{item.thickness}</h3>
                            <p>Total: {item.weight.toFixed(2)} kg</p>
                        </div>
                    ))}
                </div>
            </div>

            {isDetailsVisible && selectedCard && (
                <GenericForm
                    fields={[
                        {
                            label: "Thickness",
                            name: "thickness",
                            type: "text",
                            placeholder: "Thickness",
                            value: selectedCard.thickness,
                            disabled: true,
                        },
                        {
                            label: "Scrap Type",
                            name: "scrapType",
                            type: "text",
                            placeholder: "Scrap Type",
                            value: selectedCard.scrapType,
                            disabled: true,
                        },
                        {
                            label: "Weight",
                            name: "weight",
                            type: "number",
                            placeholder: "Weight",
                            value: selectedCard.weight,
                            disabled: true,
                        },
                        {
                            label: "Actual Weight Moved",
                            name: "actualWeightMoved",
                            type: "number",
                            placeholder: "Actual Weight Moved",
                            value: actualWeight,
                            disabled: false,
                        },
                    ]}
                    title="Update Scrap"
                    onSubmit={(formData) => {
                        const actualWeightMoved = formData.get("actualWeightMoved");
                        if (Number(actualWeightMoved) > selectedCard.weight) {
                            toast.error("Actual Weight Moved cannot be greater than the selected card weight.");
                            return;
                        }
                        console.log("Form submitted:", formData);
                        setActualWeightMoved(actualWeightMoved);
                        setPopupVisible(true);
                        setFormData(formData);
                    }}
                    onClose={() => setDetailsVisible(false)}
                    customButtons={(formData, onClose) => (
                        <>
                            <button className="close-button" onClick={onClose}>
                                Cancel
                            </button>
                        </>
                    )}
                />
            )}
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
                        <button className="popup-close" onClick={handlePopupClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {!scrapType && loading && (
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
        </>
    );
};

export default ScrapByThickness;