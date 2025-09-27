import { ScanQr } from "../util/mock";
import apiClient from "./ApiService";
const ScanQrServices = {
  getScanQr: async (qrCodeNumber) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return ScanQr();
    }
    // const response = await apiClient.get("/scanqr/getall",{
    //     serach:searchQuery,
    //     page:currPage,
    //     limit:limit,
    //     filter:filters
    // });
    // return response;
    const response = await apiClient.get(`/api/getQrData`, {
      //params: { qrCodeNumber: qrCodeNumber },
      params: qrCodeNumber,
    });

    return response;
  },
};

export default ScanQrServices;
