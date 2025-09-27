import React, { useState, useEffect } from "react";
import apiClient from "../services/ApiService";
import log from "../components/logger";

const useQRCode = (value) => {
    const [qrCode, setQrCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQrCode();
    }, [value]);

    const fetchQrCode = async () => {
        try {
            setLoading(true);
            setError(null);
            log.info("Fetching QR code...");
            // const response = await apiClient.get("/qrcode");
            // log.info("Response:", response);
            // if (response.responseStatusList.status[0] === 200) {
            //     setQrCode(response.responseObject.data.qrCode);
            // } else {
            //     setError("Failed to fetch QR code.");
            // }
            setQrCode(value);
        } catch (error) {
            log.error("Error while fetching QR code:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { qrCode, loading, error };
};

export default useQRCode;