import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import PetaPage from "./pages/PetaPage";
import LaporanPage from "./pages/LaporanPage";
import LaporanDetailPage from "./pages/LaporanDetailPage";
import TrendPage from "./pages/TrendPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { useRequireAuth } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("aduin_user");
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected admin */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/peta" element={<ProtectedRoute><PetaPage /></ProtectedRoute>} />
          <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
          <Route path="/laporan/:id" element={<ProtectedRoute><LaporanDetailPage /></ProtectedRoute>} />
          <Route path="/tren" element={<ProtectedRoute><TrendPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          {/* TODO: Add more routes
          <Route path="/peta" element={<PetaPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/laporan/:id" element={<LaporanDetailPage />} />
          <Route path="/tren" element={<TrendPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          */}

          {/* Warga routes
          <Route path="/lapor" element={<FormPage />} />
          <Route path="/lapor/sukses/:id" element={<SuccessPage />} />
          <Route path="/cek-status" element={<CekStatusPage />} />
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}