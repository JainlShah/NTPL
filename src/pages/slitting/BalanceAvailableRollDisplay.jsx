import React, { useEffect } from "react";


const BalanceAvailableRollDisplay = ({ data, onContinue, onClose }) => {
    useEffect(() => {
        console.log("data of balanced roll", data);
    })
    return (
        <div className="balanceRollDisplay-container">
            <div className="popup-container">
            <h2>You have entered maximum stack and you can generate more roll for the planned slitting program</h2>
            <h4>Available planned slitting </h4>
            <table className="common-table">
            <thead>
            <tr>
                <th>Width (mm)</th>
                <th>Balanced weight (kg)</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                <td>{row.jobNumber === null || row.jobNumber === "Extra" ? `${row.width} - Extra` : row.width}</td>
                <td>{(row.weight - row.actualWeight).toFixed(1)}</td>
                </tr>
            ))}
            </tbody>
            </table>
            <div className="action-container">

            <button className="close-button" onClick={onClose}>Close & Generate</button>
            <button className="submit-button" onClick={onContinue}>Generate & Continue</button>
            </div>
            </div>
        </div>
        // </div>
    );
};

export default BalanceAvailableRollDisplay;