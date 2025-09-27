import { useEffect, useState } from "react";
import log from "../components/logger";
import ScanQrServices from "../services/ScanQrServices";

const useScanQr = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // const [pagination, setPagination] = useState({
  //     currentPage:1,
  //     totalPages:1,
  //     itemsPerPage:10,
  //     totalItems:0
  // });

  const fetchScanQr = async (qrCodeNumber) => {
    if (!qrCodeNumber) {
      setError("QR code number is required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      log.info("Fetching scan qr data...");
      const response = await ScanQrServices.getScanQr({
        qrCodeNumber,
        // searchQuery,
        // currPage,
        // limit:pagination.itemsPerPage,
        // filters,
      });
      log.info("Scan qr  data fetched successfully.", response);
      if (response.responseStatusList.statusList[0].statusCode === 200) {
        setData(response.responseObject.data);
        console.log("data", response);
        log.info("Scan qr  data fetched successfully.", response);
        
      } else {
        setData(null);
        //   log.error("Failed to fetch scan qr  data:", statusDesc);
        setError(response.responseStatusList.statusList[0].statusDesc);
      }
    } catch (err) {
      setData(null);
      log.error("Error fetching scan qr  data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // setPagination({
    //     currentPage:currPage,
    //     totalPages:1,
    //     itemsPerPage:10
    // });
    fetchScanQr();
  }, []);

  return { data, loading, error, handleScanQr: fetchScanQr };
};

export default useScanQr;
