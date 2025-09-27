import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { isMobile, isTablet } from "react-device-detect";

const QRScanner = () => {
  const videoRef = useRef(null);
  const [deviceType, setDeviceType] = useState("");
  const [scannerMode, setScannerMode] = useState(null);
  const [qrResult, setQrResult] = useState("");
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  let codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    if (isMobile) {
      setDeviceType("Mobile");
    } else if (isTablet) {
      setDeviceType("Tablet");
    } else {
      setDeviceType("Desktop");
    }
  }, []);

  useEffect(() => {
    if (scannerMode === "camera") {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scannerMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraAccessible(true);
      setPermissionDenied(false);
      scanQRCode();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraAccessible(false);
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
      if (result) {
        alert(`QR Code Detected: ${result.getText()}`);
        setQrResult(result.getText());
        stopCamera();
      }
      if (err) {
        console.log("No QR code detected");
      }
    });
  };

  return (
    <div id="qr-scanner">
      <h3>Device: {deviceType}</h3>

      <div>
        <h4>Choose Input Method</h4>
        <button onClick={() => setScannerMode("camera")} className="submit-button">
          Use Camera
        </button>
        <button onClick={() => setScannerMode("scanner")} className="submit-button">
          Use Scanner
        </button>
      </div>

      {scannerMode === "camera" && (
        <div>
          {permissionDenied && (
            <p style={{ color: "red" }}>
              Camera access denied. Please enable camera permission in your browser settings.
            </p>
          )}

          {isCameraAccessible && (
            <div>
              <video ref={videoRef} style={{ width: "100%" }} autoPlay muted />
              <p>Camera is ready. Scan your QR code.</p>
            </div>
          )}

          {qrResult && <p style={{ color: "green" }}>Scanned QR Code: {qrResult}</p>}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
