import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage";
import PatientDetails from "./pages/PatientDetailsPage/PatientDetails";
import PatientList from "./pages/PatientsListPage/PatientList";
import Profile from "./pages/Profile/Profile";
import SignInSignUp from "./pages/SignInSignUp/SignInSignUp";
import AnalysisPage from "./pages/XRayUploadPage/XRayUpload";
import HistoryList from "./pages/PatientHistoryPage/PatientHistory";
import PatientOverview from "./pages/PatientHomepage/PatientHomepage";
import HistoryDetailsPage from "@/pages/HistoryDetailsPage/HistoryDetailsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInSignUp />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-xray/:id" element={<AnalysisPage />} />
        <Route path="/history/:id" element={<HistoryList />} />
        <Route path="/overview" element={<PatientOverview />} />
        <Route path="/history/:id/details" element={<HistoryDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
