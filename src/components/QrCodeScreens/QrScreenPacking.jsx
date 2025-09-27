import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import "../../styles/QRCodeScreen.css";

const QRScreenPacking = ({ value, onClose, title }) => {
  useEffect(() => {
    console.log("QR Code Screen Value: ", JSON.stringify(value));
  }, [value]);

  const handlePrint = () => {
    const printContent = document.querySelector(".qr-screen-container").innerHTML;
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
                size: 3.6in 1.8in; /* Set label size */
                margin: 0; /* Remove margins */
              }
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
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
                margin-right:15px;
                margin-bottom: 5px;
              }
  
              .left-section{
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1in; 
}
  
              .barcode-details-container {
                font-size: 12px;
                width: 100%;
                text-align: center;
                margin-right: 10px;
              }
  
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 2px;
                font-size: 10px;
              }
                .left-section p{
                  font-size: 20px;
                  font-weight: bold;
                }
  
              .action-container { display: none !important; }

              .barcode-details-container .key{
                font-weight: bold;
                font-size: 12px;
              }
                .barcode-details-container .value{
                font-weight: bold;
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-content">${printContent}</div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
      `);
    printWindow.contentDocument.close();
    printWindow.contentWindow.focus();
    printWindow.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(printWindow);
    }, 100);
  };
  // const handlePrint = () => {
  //   const printContent = document.querySelector(
  //     ".qr-screen-container"
  //   ).innerHTML;
  //   const printWindow = document.createElement("iframe");
  //   printWindow.style.position = "absolute";
  //   printWindow.style.top = "-1000px";
  //   printWindow.style.left = "-1000px";
  //   document.body.appendChild(printWindow);

  //   printWindow.contentDocument.write(`
  //     <html>
  //     <head>
  //       <title>Print QR Code</title>
  //       <style>
  //         @media print {
  //           @page {
  //             size: landscape;
  //             margin: 0;
  //           }
  //           body {
  //             margin: 0;
  //             padding: 0;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //           }

  //           .rotate-container {
  //             transform: rotate(90deg);
  //             transform-origin: center;
  //             display: flex;
  //             flex-direction: column;
  //             align-items: center;
  //             justify-content: center;
  //             width: 3.8in;
  //             height: 1.8in;
  //           }

  //           .qr-item {
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //             flex-direction: column;
  //             background-color: rgb(252, 246, 246);
  //             border-radius: 8px;
  //             border: 1px solid rgb(0, 0, 0);
  //             box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  //             width: 1.8in;
  //             height: 3.8in;
  //             margin: 5px 0;
  //             page-break-after: always;
  //             text-align: center;
  //             font-size: 6px;
  //           }

  //           .qr-container {
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //             background-color: white;
  //             border-radius: 8px;
  //             box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  //             padding: 2px;
  //             width: 80%;
  //             max-width: 1.8in;
  //           }

  //           .details-container {
  //             color: rgb(0, 0, 0);
  //             border-radius: 8px;
  //             text-align: center;
  //             width: 80%;
  //             padding-top: 5px;
  //             font-size: 10px;
  //           }

  //           .qr-content {
  //             padding: 0;
  //             display: block !important;
  //           }

  //           .action-container { display: none !important; }
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="rotate-container">
  //         ${printContent}
  //       </div>
  //       <script>
  //         window.onload = function() {
  //           window.print();
  //         };
  //       </script>
  //     </body>
  //     </html>
  //   `);

  //   printWindow.contentDocument.close();
  //   printWindow.contentWindow.focus();
  //   printWindow.contentWindow.print();

  //   setTimeout(() => {
  //     document.body.removeChild(printWindow);
  //   }, 100);
  // };

  const isArray = Array.isArray(value);

  return (
    <div className="qr-screen-container">
      <div className="qr-content">
        {isArray ? (
          value.map((item, index) => (
            <div key={index} className="qr-item">
              <div className="left-section">
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px", // Reduced font size
                  padding: "0px",
                }}
              >
                Job No: {item.jobNumber}
              </p>
              {/* {item.rollNumber && ( 
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px", // Reduced font size
                    padding: "0px",
                  }}
                >
                  Roll No: {item.rollNumber}
                </p>
              )} */}
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
                <div className="detail-row">
                  <span className="key">Drawing No:</span>
                  <span className="value">{item.drawingNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="key">Work Order:</span>
                  <span className="value">{item.workOrder}</span>
                </div>
                <div className="detail-row">
                  <span className="key">Customer Name:</span>
                  <span className="value">{item.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="key">Packed Weight:</span>
                  <span className="value">{item.packedWeight} kg</span>
                </div>
                <div className="detail-row">
                  <span className="key">PO Number:</span>
                  <span className="value">{item.poNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="key">Packing Date:</span>
                  <span className="value">{item.packingDate}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="qr-item">
            <div className="left-section">
            <p
              style={{ textAlign: "center", fontSize: "13px", padding: "0px" }}
            >
              Job No: {value.jobNumber}
            </p>
            {/* {value.rollNumber && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  padding: "0px",
                }}
              >
                Roll No: {value.rollNumber}
              </p>
            )} */}
            <div className="qr-container">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={value.qrCodeNumber}
                viewBox="0 0 256 256"
              />
            </div>
            </div>
            <h3 style={{ fontSize: "12px" }}>{title}</h3>
            <div className="barcode-details-container">
              <div className="detail-row">
                <span className="key">Drawing No:</span>
                <span className="value">{value.drawingNumber}</span>
              </div>
              <div className="detail-row">
                <span className="key">Work Order:</span>
                <span className="value">{value.workOrder}</span>
              </div>
              <div className="detail-row">
                <span className="key">Customer Name:</span>
                <span className="value">{value.customerName}</span>
              </div>
              <div className="detail-row">
                <span className="key">Packed Weight:</span>
                <span className="value">{value.packedWeight} kg</span>
              </div>
              <div className="detail-row">
                <span className="key">PO Number:</span>
                <span className="value">{value.poNumber}</span>
              </div>
              <div className="detail-row">
                <span className="key">Packing Date:</span>
                <span className="value">{value.packingDate}</span>
              </div>
            </div>
          </div>
        )}
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
export default QRScreenPacking;
