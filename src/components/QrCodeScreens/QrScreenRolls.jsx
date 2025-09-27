import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import "../../styles/QRCodeScreen.css";

const QRScreenRolls = ({ value, onClose, title }) => {
  useEffect(() => {
    console.log("QR Code Screen Value: ", JSON.stringify(value));
  }, [value]);

  const handlePrint = () => {
    const printContent = document.querySelector(
      ".qr-screen-container"
    ).innerHTML;
    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.top = "-1000px";
    printWindow.style.left = "-1000px";
    document.body.appendChild(printWindow);

    printWindow.contentDocument.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            @media print {
              @page {
                size: 3.6in 1.8in;
                margin: 0;
              }
              body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: auto;
                overflow: visible !important;
              }

              .qr-content {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: flex-start;
                page-break-after: auto;
              }

              .qr-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                width: 3.6in;
                height: 1.8in;
                text-align: center;
                font-size: 14px;
                border-radius: 8px;
                border: 1px solid black;
                margin: 5px;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }

              .left-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
              }

              .qr-container {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
                border-radius: 8px;
                width: 100%;
                max-width: 1in;
              }

              .barcode-details-container {
                font-size: 12px;
                width: 100%;
                text-align: center;
              }

              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 2px;
                font-size: 10px;
              }

              .left-section p {
                font-size: 20px;
                font-weight: bold;
              }

              .barcode-details-container .key {
                font-weight: bold;
                font-size: 12px;
              }

              .barcode-details-container .value {
                font-weight: bold;
                font-size: 14px;
              }

              .action-container {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-content">${printContent}</div>
          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.contentDocument.close();
    printWindow.contentWindow.focus();

    setTimeout(() => {
      document.body.removeChild(printWindow);
    }, 1000);
  };

  const isArray = Array.isArray(value);

  return (
    <div className="qr-screen-container">
      <div className="qr-content">
        {(isArray ? value : [value]).map((item, index) => (
          <div key={index} className="qr-item">
            <div className="left-section">
              <p
                style={{ textAlign: "center", fontSize: "13px", margin: "2px" }}
              >
                Coil No: {item.coilNumber}
              </p>
              {item.rollNumber &&
                item.rollNumber !== "NA" &&
                item.rollNumber !== "N/A" && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      margin: "2px",
                    }}
                  >
                    Roll No: {item.rollNumber}
                  </p>
                )}
              {item.status && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    margin: "2px",
                    fontWeight: 800,
                  }}
                >
                  {item.status.toUpperCase() === "REJECT"
                    ? "REJECTED"
                    : item.status.toUpperCase() === "TRANSFER"
                    ? "TRANSFERRED"
                    : item.status.toUpperCase()}
                </p>
              )}
              <div className="qr-container">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={item.qrCodeNumber}
                  viewBox="0 0 256 256"
                />
              </div>
            </div>
            <h3 style={{ fontSize: "10px" }}>{title}</h3>
            <div className="barcode-details-container">
              {item.drawingNumber &&
                item.drawingNumber !== "NA" &&
                item.drawingNumber !== "N/A" &&
                item.drawingNumber !== "Extra" && (
                  <div className="detail-row">
                    <span
                      className="key"
                      style={{ fontWeight: 600, fontSize: "14px" }}
                    >
                      Drawing No:
                    </span>
                    <span
                      className="value"
                      style={{ fontWeight: 600, fontSize: "14px" }}
                    >
                      {item.drawingNumber}
                    </span>
                  </div>
                )}
              <div className="detail-row">
                <span className="key">Width:</span>
                <span className="value">{item.width} mm</span>
              </div>
              <div className="detail-row">
                <span className="key">Weight:</span>
                <span className="value">{item.weight} KG</span>
              </div>
              <div className="detail-row">
                <span className="key">Grade:</span>
                <span className="value">{item.grade}</span>
              </div>
              <div className="detail-row">
                <span className="key">Material Type:</span>
                <span className="value">{item.materialType.toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <span className="key">Date:</span>
                <span className="value">{item.registeredDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="action-container">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <button className="move-button" onClick={handlePrint}>
          Print
        </button>
      </div>
    </div>
  );
};

export default QRScreenRolls;
