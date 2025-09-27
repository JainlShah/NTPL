import React, { useState, useEffect } from "react";
import "../../styles/Remark.css";

const Remark = (props) => {
    const [remark, setRemark] = useState(props.remark);

    useEffect(() => {
        setRemark(props.remark);
    }, [props.remark]);

    return (
        <div className="remark-popup-container">
            <div className="remark-popup-body">
                <div className="remark-input-container">
                    <label>Remark:</label>
                    <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />
                </div>
                <div className="action-container">
                    <button className="close-button" onClick={props.onClose}>Cancel</button>
                    <button className="submit-button" onClick={() => props.onSave(remark)}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default Remark;