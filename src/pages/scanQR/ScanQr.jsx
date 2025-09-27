import { useEffect, useState, useCallback, useRef } from "react";
import "../../styles/scanQr.css";
import useScanQr from "../../hooks/useScanQr";
import animationData from "../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../assets/nodata.png";
import { isMobile, isTablet } from "react-device-detect";
import { BrowserMultiFormatReader } from "@zxing/library";
const ScanQr = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error, handleScanQr } = useScanQr();
  const [scannerMode, setScannerMode] = useState("camera");
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef(null);
  const [isCameraRequested, setIsCameraRequested] = useState(false);
  let codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    if (scannerMode === "camera") {
      handleCameraPermission();
      startCamera();
    } else if (scannerMode === "scanner") {
      alert("Please connect an external QR scanner.");
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [scannerMode]);

  const handleCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported on this browser.");
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length === 0) {
        if(!isMobile && !isTablet && scannerMode !== "camera"){
          alert("No camera found. Please connect a webcam.");
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraAccessible(true);
      setPermissionDenied(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "Camera access denied. Please enable it in your browser settings."
        );
      }
      setIsCameraAccessible(false);
      setPermissionDenied(true);
    }
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toUpperCase());
    debouncedSearchChange(e.target.value.toUpperCase());
  };

  // const debouncedSearchChange = useCallback(debounce(handleScanQr, 500), [
  //   handleScanQr,
  // ]);
  const debouncedSearchChange = useCallback(debounce(handleScanQr, 500), []);
  const handleFileDownload = (filePath, fileName) => {
    // Assuming `filePath` contains the full URL or valid file path
    const downloadLink = document.createElement("a");
    downloadLink.href = filePath;
    downloadLink.download = fileName; // Sets the suggested file name
    document.body.appendChild(downloadLink); // Attach to the DOM
    downloadLink.click(); // Programmatically trigger click
    document.body.removeChild(downloadLink); // Clean up
  };
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
    if (!videoRef.current) return;

    codeReader.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      (result, err) => {
        if (result) {
          console.log(`QR Code Detected: ${result.getText()}`);
          setSearchQuery(result.getText());
          debouncedSearchChange(result.getText());
          stopCamera(); // Stop the camera after scanning
          setScannerMode("");
          codeReader.reset(); // Reset the scanner

        } else if (err && err.name !== "NotFoundException") {
          console.error("QR Code scanning error:", err);
        }
      }
    );
  };

  return (
    <div id="main-div" className="scan-qr">
      <div id="main-div1" className="scan-qr-body">
        <div className="top-container">
          <div className="searchBar">
            <i className="search-icon fa fa-search"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {(isMobile || isTablet) && (
            <div className="filter-container">
              <i
                className={`icon fa-solid fa-camera`}
                onClick={() => {
                  setScannerMode("camera")
                  setIsCameraRequested(true)
                  if (!isCameraAccessible) {
                    handleCameraPermission()
                  }
                }}
              ></i>
            </div>
          )}
        </div>

        {data?.jobAttributes?.length > 0 ? (
          <>

            <div id="main-div2" className="scan-qr-data">
              <div id="sub-div1" className="scan-container">
                <h2 style={{ color: "white" }}>Job Details</h2>
                <div className="two-column-layout">
                  <div className="label-data-pair">
                    <label htmlFor="coil">Job No.</label>
                    <div className="inside-data">
                      <p>{data.jobNumber}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Width">Work Order</label>
                    <div className="inside-data">
                      <p>{data.workOrder}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Thickness">Drawing No.</label>
                    <div className="inside-data">
                      <p>{data.drawingNumber}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Weight">Sets</label>
                    <div className="inside-data">
                      <p>{data.sets}</p>
                    </div>
                  </div>
                </div>
                <div className="two-column-layout">

                  <div className="label-data-pair">
                    <label htmlFor="Thickness">PO No.</label>
                    <div className="inside-data">
                      <p>{data.PONumber}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="coil">Customer Name</label>
                    <div className="inside-data">
                      <p>{data.customerName}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="coil">Drawing Weight (kg)</label>
                    <div className="inside-data">
                      <p>{data.drawingWeight}</p>
                    </div>
                  </div>
                </div>

                <div id="main-div3" className="table-data">
                  <label
                    htmlFor="Rolls"
                    style={{
                      marginBottom: "10px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Job Attributes
                  </label>
                  {data?.jobAttributes?.length > 0 ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Width (mm)</th>
                            <th>Thickness (mm)</th>
                            <th>Trim weight (kg)</th>
                            <th>Process weight (kg)</th>
                            <th>Consumed weight (kg)</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        {
                          data.jobAttributes.map((job, index) => (
                            job.processWeight > 0 && (
                              <tbody>
                                <tr key={index}>
                                  <td>{job.width}</td>
                                  <td>{job.thickness}</td>
                                  <td>{job.trimmingWeight}</td>
                                  <td>{job.processWeight}</td>
                                  <td>{job.usedWeight || "0"}</td>
                                  <td>
                                    {
                                      new Date(job.createdAt)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </td>
                                </tr>

                              </tbody>
                            )
                          ))

                        }
                      </table>
                    </div>
                  ) : (
                    <p className="no-data">No slitting details available.</p>
                  )}
                </div>

                <div className="two-column-layout">

                  <div className="label-data-pair">
                    <label htmlFor="coil">Date of creation</label>
                    <div className="inside-data">
                      <p>{new Date(data.createdAt)
                        .toISOString()
                        .split("T")[0]}</p>
                    </div>
                  </div>

                </div>

                <div />
              </div>

            </div>

          </>
        ) :
          data && !searchQuery.includes("_") ? (
            <div id="main-div2" className="scan-qr-data">
              <div id="sub-div1" className="scan-container">
                <div className="two-column-layout">
                  <div className="label-data-pair">
                    <label htmlFor="coil">Coil No.</label>
                    <div className="inside-data">
                      <p>{data.coilNumber}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Width">Width</label>
                    <div className="inside-data">
                      <p>{data.width}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Thickness">Thickness</label>
                    <div className="inside-data">
                      <p>{data.thickness}</p>
                    </div>
                  </div>
                  <div className="label-data-pair">
                    <label htmlFor="Weight">Weight</label>
                    <div className="inside-data">
                      <p>{data.weight}</p>
                    </div>
                  </div>
                </div>

                <div id="main-div3" className="table-data">
                  <label
                    htmlFor="Rolls"
                    style={{
                      marginBottom: "10px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Rolls
                  </label>
                  {!loading && !error && data?.rollsData?.length > 0 ? (

                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Roll No.</th>
                            <th>Width (mm)</th>
                            <th>Thickness (mm)</th>
                            <th>Weight (kg)</th>
                            <th>Program status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        {data.rollsData.length > 0 ? (
                          data.rollsData.map((roll, index) => (
                            roll.weight > 0 && (
                              <tbody>
                                <tr key={index}>
                                  <td>{roll.rollNumber}</td>
                                  <td>{roll.width}</td>
                                  <td>{roll.thickness}</td>
                                  <td>{roll.weight}</td>
                                  <td>{roll.programStatus || "N/A"}</td>
                                  <td>
                                    {
                                      new Date(roll.createdAt)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </td>
                                </tr>

                              </tbody>
                            )
                          ))

                        ) : (
                          <p className="no-data">
                            No rolls data available for this slitting program.
                          </p>
                        )}
                      </table>
                    </div>
                  ) : (
                    <p className="no-data">No slitting details available.</p>
                  )}
                </div>

                <label htmlFor="date">Date of Registration </label>
                <div id="sub-div6" className="inside-data">
                  <p>{data.registeredDate}</p>
                </div>

                {/* <label htmlFor="file">Upload File </label> */}
                {/* <div id="sub-div7" className="inside-data">
               
                <span>
                  <p>
                    1 File.pdf{" "}
                    <button style={{ color: "#3498db" }}>Download</button>{" "}
                  </p>
                </span>
                <span>
                  <p>
                    2 File.pdf{" "}
                    <button style={{ color: "#3498db" }}>Download</button>{" "}
                  </p>
                </span>{" "}
              </div> */}
                <label htmlFor="file"> Files</label>
                <div id="sub-div7" className="inside-data">
                  {data.document && data.document.length > 0 ? (
                    data.document.map((file, index) => (
                      <div key={file.documentID}>
                        <p>
                          {index + 1}. {file.fileName}{" "}
                          <button
                            style={{ color: "#3498db" }}
                            onClick={() =>
                              handleFileDownload(file.filePath, file.fileName)
                            }
                          >
                            Download
                          </button>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No files uploaded.</p>
                  )}
                </div>
              </div>
            </div>
          ) : data && searchQuery.includes("_") ? (
            <>
              <div id="main-div2" className="scan-qr-data">
                <h2>Roll Details</h2>
                <div id="sub-div1" className="scan-container">
                  <div className="two-column-layout">
                    <div className="label-data-pair">
                      <label htmlFor="coil">Roll No.</label>
                      <div className="inside-data">
                        <p>{data.rollNumber}</p>
                      </div>
                    </div>
                    <div className="label-data-pair">
                      <label htmlFor="Width">Coil No.</label>
                      <div className="inside-data">
                        <p>{data?.coilNumber}</p>
                      </div>
                    </div>
                    <div className="label-data-pair">
                      <label htmlFor="Thickness">Date</label>
                      <div className="inside-data">
                        <p>{new Date(data.createdAt).toISOString().split("T")[0]}</p>
                      </div>
                    </div>
                    <div className="label-data-pair">
                      <label htmlFor="coil">Status</label>
                      <div className="inside-data">
                        <p>{data.programStatus}</p>
                      </div>
                    </div>

                  </div>
                  <div className="two-column-layout">


                    <div className="label-data-pair">
                      <label htmlFor="Thickness">Width (mm)</label>
                      <div className="inside-data">
                        <p>{data.width}</p>
                      </div>
                    </div>
                    <div className="label-data-pair">
                      <label htmlFor="Thickness">Thickness (mm)</label>
                      <div className="inside-data">
                        <p>{data.thickness}</p>
                      </div>
                    </div>
                    <div className="label-data-pair">
                      <label htmlFor="coil">Weight (kg)</label>
                      <div className="inside-data">
                        <p>{data.actualWeight}</p>
                      </div>
                    </div>

                  </div>

                  {data.workOrder && (
                    <>
                      <h2 style={{ color: "white" }}>Job Information</h2>
                      <div className="two-column-layout">

                        <div className="label-data-pair">
                          <label htmlFor="Thickness">Job No.</label>
                          <div className="inside-data">
                            <p>{data.jobNumber}</p>
                          </div>
                        </div>
                        <div className="label-data-pair">
                          <label htmlFor="Thickness">Work Order</label>
                          <div className="inside-data">
                            <p>{data.workOrder}</p>
                          </div>
                        </div>
                        <div className="label-data-pair">
                          <label htmlFor="coil">Drawing No.</label>
                          <div className="inside-data">
                            <p>{data.drawingNumber}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div />
                </div>
              </div>

            </>

          ) :
            (
              <div className="no-data-container">
                <img
                  src={nodata}
                  alt="No data available"
                  style={{ width: "200px", height: "200px" }}
                />
                <p className="no-data">No data available</p>
              </div>
            )
        }


      </div>
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
      {scannerMode === "camera" && (isMobile || isTablet)&& (
        <div className="camera-container">
          {/* {!isCameraRequested && !permissionDenied && (
            <p style={{ color: "red" }}>Please enable camera permission.</p>
          )} */}
          {permissionDenied && (
            <div className="permission-container">
              <p style={{ color: "red" }}>
                Camera access denied. Please enable camera permission in your browser settings.
              </p>
              <button onClick={handleCameraPermission}>Grant Permission</button>
            </div>
          )}

          {isCameraAccessible && (
            <div className="full-screen-camera">
              <video ref={videoRef} autoPlay muted />
              <p className="scan-text">Place your camera over the QR code</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ScanQr;
