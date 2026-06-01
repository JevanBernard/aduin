import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import PetaPage from "./pages/PetaPage";
import LaporanPage from "./pages/LaporanPage";
import LaporanDetailPage from "./pages/LaporanDetailPage";
import TrendPage from "./pages/TrendPage";
import SettingsPage from "./pages/SettingsPage";

import FormPage from "./pages/FormPage";
import SuccessPage from "./pages/SuccessPage";
import CekStatusPage from "./pages/CekStatusPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/peta" element={<PetaPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/laporan/:id" element={<LaporanDetailPage />} />
          <Route path="/tren" element={<TrendPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* TODO: Add more routes
          <Route path="/peta" element={<PetaPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/laporan/:id" element={<LaporanDetailPage />} />
          <Route path="/tren" element={<TrendPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          */}
          
          {/* Warga routes */}
          <Route path="/lapor" element={<FormPage />} />
          <Route path="/lapor/sukses/:id" element={<SuccessPage />} />
          <Route path="/cek-status" element={<CekStatusPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}