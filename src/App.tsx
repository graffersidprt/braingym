import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Routes, Route } from "react-router-dom";
import OtpPage from "./pages/OtpPage";
import ConfirmPasswordPage from "./pages/ConfirmPasswordPage";
import PasswordUpdateSuccessPage from "./pages/PasswordUpdateSuccessPage";
import PageNotFoundPage from "./pages/PageNotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import OrganizationPage from "./pages/OrganizationPage";
import BrainHealthDetailPage from "./pages/BrainHealthDetailPage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<PageNotFoundPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="organizaion-details" element={<OrganizationPage />} />
        <Route path="terms-conditions" element={<TermsAndConditionsPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="reset-password" element={<ConfirmPasswordPage />} />
        <Route
          path="password-update-success"
          element={<PasswordUpdateSuccessPage />}
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="brain-health-detail" element={<BrainHealthDetailPage />} />
        <Route path='edit-profile' element={<EditProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
