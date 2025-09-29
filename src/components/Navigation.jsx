import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./navbar/Navbar.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import CoilsInventory from "../pages/dashboard/coilInventory.jsx";
import RollInventroy from "../pages/dashboard/rollInventory/rollInventory.jsx";
import Footer from "./footer/Footer.jsx";
import ScrapScreen from "../pages/dashboard/scrap/ScrapScreen.jsx";
import ShortList from "../pages/dashboard/ShortList.jsx";
import PlannedSlitting from "../pages/dashboard/PlannedSlitting.jsx";
import Slitting from "../pages/slitting/Slitting.jsx";
import JobOrderList from "../pages/dashboard/jobOrder/jobOrderList.jsx";
import Cutting from "../pages/cutting/Cutting.jsx";
import AddScrap from "../pages/cutting/AddScrap.jsx";
import Packing from "../pages/packing/packing.jsx";
import ScanQr from "../pages/scanQR/ScanQr.jsx";
import Demo from "../pages/scanQR/Demo.jsx";
import RollsReadyCutting from "../pages/cutting/RollsReadyCutting.jsx";
import Dashboar from "../pages/dashboard.jsx";
import Chat from "./chat/Chat.jsx";
import QRScanner from "../pages/QRScannerfor.jsx";
import JobReport from "../pages/report/jobReport.jsx";
import ReportDashboard from "../pages/report/dashboard.jsx";
import JobworkLanding from '../modules/JobworkModule/JobworkLanding.jsx';
import MakeJobwork from '../modules/JobworkModule/MakeJobwork.jsx';
import FinalQC from '../pages/jobwork/FinalQC.jsx';
import SlittingReports from '../pages/jobwork/SlittingReports.jsx';
import JobworkReport from '../pages/jobwork/JobworkReport.jsx';
function Navigation() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coil-inventory"
          element={
            <ProtectedRoute>
              <CoilsInventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roll-inventory"
          element={
            <ProtectedRoute>
              <RollInventroy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scrap"
          element={
            <ProtectedRoute>
              <ScrapScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joborderlist"
          element={
            <ProtectedRoute>
              <JobOrderList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shortlist"
          element={
            <ProtectedRoute>
              <ShortList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planned-slitting"
          element={
            <ProtectedRoute>
              <PlannedSlitting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slitting"
          element={
            <ProtectedRoute>
              <Slitting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting"
          element={
            <ProtectedRoute>
              <Cutting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-scrap"
          element={
            <ProtectedRoute>
              <AddScrap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rolls-ready-cutting"
          element={
            <ProtectedRoute>
              <RollsReadyCutting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packing"
          element={
            <ProtectedRoute>
              <Packing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <ScanQr />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo"
          element={
            <ProtectedRoute>
              <Demo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobwork"
          element={
            <ProtectedRoute>
              <JobworkLanding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobwork/new"
          element={
            <ProtectedRoute>
              <MakeJobwork />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobwork/finalqc"
          element={
            <ProtectedRoute>
              <FinalQC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobwork/slitting-report"
          element={
            <ProtectedRoute>
              <SlittingReports onClose={() => window.history.back()} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobwork/reports"
          element={
            <ProtectedRoute>
              <JobworkReport />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default Navigation;
