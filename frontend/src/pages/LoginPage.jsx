import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Kredensial sementara — nanti ganti dengan JWT dari backend
const CREDENTIALS = [
  { email: "admin@aduin.go.id", password: "admin123", name: "Super Admin", role: "SUPER_ADMIN" },
  { email: "operator@aduin.go.id", password: "operator123", name: "Operator", role: "ADMIN" },
];

export default function LoginPage() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Panggil API backend
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Simpan user + token ke localStorage
        localStorage.setItem("aduin_user", JSON.stringify({
          ...data.user,
          token: data.token,
        }));
        navigate("/");
      } else {
        setError(data.message || "Email atau password salah");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    }

    setLoading(false);
  };

  const inputBg = dark ? "#0f172a" : "#fff";
  const inputBorder = dark ? "#334155" : "#e2e8f0";
  const textPrimary = dark ? "#e2e8f0" : "#1e293b";
  const textSecondary = dark ? "#64748b" : "#94a3b8";

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-300"
      style={{ background: dark ? "#0f172a" : "#f7f9fc" }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: dark ? "#1e293b" : "#0B1120" }}
        aria-label="Toggle tema"
      >
        {dark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        )}
      </button>

      <div className="w-full max-w-sm mx-4">
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ background: dark ? "#0a0f1a" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#f0f0f0"}` }}
          >
            <span style={{ fontFamily: "'Pridi', serif", fontSize: 48, color: "#021d54", lineHeight: 1 }}>a</span>
          </div>
          <h1 className="text-2xl font-bold font-raleway" style={{ color: textPrimary }}>ADUIN</h1>
          <p className="text-xs font-pridi mt-1" style={{ color: dark ? "#475569" : "#021d54" }}>
            Analisis Digital Untuk Insight Nusantara
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "#fff",
            boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}`,
          }}
        >
          <h2 className="text-lg font-bold font-raleway mb-1" style={{ color: textPrimary }}>
            Masuk ke Dashboard
          </h2>
          <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>
            Khusus admin & operator ADUIN
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold font-raleway mb-1.5" style={{ color: textPrimary }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aduin.go.id"
                required
                className="w-full px-4 py-3 rounded-lg text-sm font-raleway outline-none transition"
                style={{
                  background: inputBg,
                  border: `1.5px solid ${error ? "#ef4444" : inputBorder}`,
                  color: textPrimary,
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold font-raleway mb-1.5" style={{ color: textPrimary }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm font-raleway outline-none transition pr-11"
                  style={{
                    background: inputBg,
                    border: `1.5px solid ${error ? "#ef4444" : inputBorder}`,
                    color: textPrimary,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: textSecondary }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-raleway text-red-500 -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold font-raleway text-white transition hover:opacity-90 disabled:opacity-50 mt-1"
              style={{ background: "#3e8bf3" }}
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
        </div>

        {/* Kredensial hint (dev only) */}
        <div
          className="mt-4 rounded-xl p-4 text-xs font-raleway"
          style={{
            background: dark ? "rgba(62,139,243,0.06)" : "rgba(62,139,243,0.05)",
            border: `1px solid rgba(62,139,243,0.2)`,
          }}
        >
          <p className="font-bold mb-2" style={{ color: "#3e8bf3" }}>Kredensial (Development)</p>
          <div className="flex flex-col gap-1" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
            <p>Super Admin: <span className="font-semibold">admin@aduin.go.id</span> / <span className="font-semibold">admin123</span></p>
            <p>
                Operator:
                <span className="font-semibold">operator@aduin.go.id</span>
                /
                <span className="font-semibold">operator123</span>
            </p>
            </div>
        </div>

        <p className="text-center text-xs font-raleway mt-5" style={{ color: textSecondary }}>
          © 2026 ADUIN — CC26-PSU299
        </p>
      </div>
    </div>
  );
}