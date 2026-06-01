import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import PetaPage from "./pages/PetaPage";
import LaporanPage from "./pages/LaporanPage";
import LaporanDetailPage from "./pages/LaporanDetailPage";
import TrendPage from "./pages/TrendPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import FormPage from "./pages/FormPage";
import SuccessPage from "./pages/SuccessPage";
import CekStatusPage from "./pages/CekStatusPage";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("aduin_user");
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public — warga */}
          <Route path="/lapor" element={<FormPage />} />
          <Route path="/lapor/sukses/:id" element={<SuccessPage />} />
          <Route path="/cek-status" element={<CekStatusPage />} />

          {/* Protected — admin */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/peta" element={<ProtectedRoute><PetaPage /></ProtectedRoute>} />
          <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
          <Route path="/laporan/:id" element={<ProtectedRoute><LaporanDetailPage /></ProtectedRoute>} />
          <Route path="/tren" element={<ProtectedRoute><TrendPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}