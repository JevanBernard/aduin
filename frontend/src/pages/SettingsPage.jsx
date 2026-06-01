import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import { PeriodDropdown, ThemeToggle, ProfileDropdown } from "../components/common/Header";
import { getKategoriSettings, updateKategoriSettings } from "../services/api";
import { resetSettingsCache } from "../hooks/useSettings";
import { getDinasSettings, updateDinasSettings } from "../services/api";


const TABS = [
  { key: "umum", label: "Umum" },
  { key: "kategori", label: "Kategori Laporan" },
  { key: "dinas", label: "Daftar Dinas" },
  { key: "wilayah", label: "Wilayah & Koordinat" }, // ← tambah ini
  { key: "notifikasi", label: "Notifikasi" },
  { key: "backup", label: "Data & Backup" },
];

export default function SettingsPage() {
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("umum");
  const [saving, setSaving] = useState(false);

  // Form state — nanti ganti dengan data dari API
  const [formData, setFormData] = useState({
    namaInstansi: "Pemerintah Provinsi Bali",
    wilayahCakupan: "Provinsi Bali (9 Kab/Kota)",
    emailAdmin: "admin@aduin.go.id",
    telepon: "+62 361-xxxxxxx",
    alamat: "Jl. Basuki Rahmat, Denpasar, Bali",
    notifUrgent: true,
    notifLaporanBaru: false,
    notifEmail: true,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: API call PUT /api/settings
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Pengaturan berhasil disimpan!");
  };

  const handleReset = () => {
    if (window.confirm("Reset semua pengaturan ke default?")) {
      setFormData({
        namaInstansi: "",
        wilayahCakupan: "",
        emailAdmin: "",
        telepon: "",
        alamat: "",
        notifUrgent: true,
        notifLaporanBaru: false,
        notifEmail: true,
      });
    }
  };

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const textPrimary = dark ? "#e2e8f0" : "#000";
  const textSecondary = dark ? "#94a3b8" : "#626262";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)";
  const cardShadow = dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.05)" : "none";
  const inputBg = dark ? "#0f172a" : "#fff";
  const inputBorder = dark ? "#334155" : "#dbdbdb";

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#0f172a" : "#f7f9fc" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 overflow-y-auto ml-0 lg:ml-20" style={{ padding: "clamp(16px, 3vw, 32px)" }} role="main">
        <div className="max-w-[1320px] mx-auto">

          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2 rounded-lg" style={{ color: textPrimary }} onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold font-raleway" style={{ color: textPrimary }}>
                  Pengaturan <span className="text-lg font-normal font-pridi" style={{ color: dark ? "#475569" : "#94a3b8" }}>ADUIN</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </header>

          <hr className="mb-6" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />

          {/* Content: Tabs + Form */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Tab navigation */}
            <nav className="lg:w-48 shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold font-raleway text-left whitespace-nowrap transition"
                  style={{
                    background: activeTab === tab.key
                      ? dark ? "rgba(62,139,243,0.15)" : "rgba(62,139,243,0.08)"
                      : "transparent",
                    color: activeTab === tab.key ? "#3e8bf3" : textSecondary,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Form area */}
            <div className="flex-1 rounded-2xl p-6 lg:p-8" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>

              {/* === TAB: UMUM === */}
              {activeTab === "umum" && (
                <>
                  <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Pengaturan Umum</h2>
                  <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>Konfigurasi dasar sistem ADUIN</p>

                  <div className="flex flex-col gap-5 max-w-xl">
                    <InputField label="Nama Instansi" value={formData.namaInstansi} onChange={(v) => handleChange("namaInstansi", v)} dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary} textSecondary={textSecondary} />
                    <InputField label="Wilayah Cakupan" value={formData.wilayahCakupan} onChange={(v) => handleChange("wilayahCakupan", v)} dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary} textSecondary={textSecondary} />
                    <InputField label="Email Admin" value={formData.emailAdmin} onChange={(v) => handleChange("emailAdmin", v)} dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary} textSecondary={textSecondary} type="email" />
                    <InputField label="Telepon" value={formData.telepon} onChange={(v) => handleChange("telepon", v)} dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary} textSecondary={textSecondary} />
                    <InputField label="Alamat" value={formData.alamat} onChange={(v) => handleChange("alamat", v)} dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary} textSecondary={textSecondary} textarea />
                  </div>

                  <ActionButtons saving={saving} onSave={handleSave} onReset={handleReset} dark={dark} />
                </>
              )}

              {/* === TAB: KATEGORI LAPORAN === */}
              {activeTab === "kategori" && (
                <KategoriTab dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} inputBg={inputBg} inputBorder={inputBorder} />
              )}

              {activeTab === "wilayah" && (
                <WilayahTab dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} inputBg={inputBg} inputBorder={inputBorder} />
              )}

              {/* === TAB: DAFTAR DINAS === */}
              {activeTab === "dinas" && (
                <DinasTab dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} inputBg={inputBg} inputBorder={inputBorder} />
              )}

              {/* === TAB: NOTIFIKASI === */}
              {activeTab === "notifikasi" && (
                <>
                  <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Notifikasi</h2>
                  <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>Atur notifikasi untuk admin</p>

                  <div className="flex flex-col gap-5 max-w-xl">
                    <ToggleField label="Notifikasi alert urgensi tinggi" desc="Notifikasi saat ada laporan dengan score ≥ 75" checked={formData.notifUrgent} onChange={(v) => handleChange("notifUrgent", v)} dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} />
                    <ToggleField label="Notifikasi laporan baru" desc="Notifikasi setiap kali ada laporan baru masuk" checked={formData.notifLaporanBaru} onChange={(v) => handleChange("notifLaporanBaru", v)} dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} />
                    <ToggleField label="Notifikasi via email" desc="Kirim notifikasi juga ke email admin" checked={formData.notifEmail} onChange={(v) => handleChange("notifEmail", v)} dark={dark} textPrimary={textPrimary} textSecondary={textSecondary} />
                  </div>

                  <ActionButtons saving={saving} onSave={handleSave} onReset={handleReset} dark={dark} />
                </>
              )}

              {/* === TAB: DATA & BACKUP === */}
              {activeTab === "backup" && (
                <>
                  <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Data & Backup</h2>
                  <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>Kelola data dan backup sistem</p>

                  <div className="flex flex-col gap-4 max-w-xl">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${inputBorder}` }}>
                      <div>
                        <p className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>Export Semua Data</p>
                        <p className="text-xs font-raleway mt-0.5" style={{ color: textSecondary }}>Download seluruh laporan dalam format CSV</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold font-raleway text-white" style={{ background: "#1d6f42" }}>Download CSV</button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${inputBorder}` }}>
                      <div>
                        <p className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>Import Data (Batch Upload)</p>
                        <p className="text-xs font-raleway mt-0.5" style={{ color: textSecondary }}>Upload file CSV untuk menambah data laporan</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold font-raleway" style={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${inputBorder}`, color: textPrimary }}>Upload CSV</button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: dark ? "rgba(239,68,68,0.05)" : "rgba(255,0,0,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <div>
                        <p className="text-sm font-bold font-raleway text-red-600">Hapus Semua Data</p>
                        <p className="text-xs font-raleway mt-0.5" style={{ color: textSecondary }}>Tindakan ini tidak dapat dibatalkan</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold font-raleway text-white bg-red-600 hover:bg-red-700 transition">Hapus</button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============ SUB COMPONENTS ============

function InputField({ label, value, onChange, dark, inputBg, inputBorder, textPrimary, textSecondary, type = "text", textarea = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold font-raleway mb-2" style={{ color: textPrimary }}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg text-sm font-raleway outline-none resize-none transition"
          style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm font-raleway outline-none transition"
          style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }}
        />
      )}
    </div>
  );
}

function ToggleField({ label, desc, checked, onChange, dark, textPrimary, textSecondary }) {
  return (
    <div className="flex items-start gap-4">
      <button
        onClick={() => onChange(!checked)}
        className="shrink-0 mt-0.5 rounded-full transition-colors duration-200"
        style={{ width: 44, height: 24, background: checked ? "#3e8bf3" : (dark ? "#334155" : "#d1d5db"), position: "relative" }}
        role="switch"
        aria-checked={checked}
      >
        <div className="absolute top-1 rounded-full bg-white transition-all duration-200 shadow-sm" style={{ width: 18, height: 18, left: checked ? 23 : 3 }} />
      </button>
      <div>
        <p className="text-sm font-semibold font-raleway" style={{ color: textPrimary }}>{label}</p>
        <p className="text-xs font-raleway mt-0.5" style={{ color: textSecondary }}>{desc}</p>
      </div>
    </div>
  );
}

function ActionButtons({ saving, onSave, onReset, dark }) {
  return (
    <div className="flex gap-3 mt-8">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-lg text-sm font-bold font-raleway text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3e8bf3" }}
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold font-raleway transition"
        style={{ background: dark ? "#1e293b" : "#fff", border: `1.5px solid ${dark ? "#334155" : "#dbdbdb"}`, color: dark ? "#94a3b8" : "#626262" }}
      >
        Reset
      </button>
    </div>
  );
}

function KategoriTab({ dark, textPrimary, textSecondary, inputBg, inputBorder }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [newKategori, setNewKategori] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch dari API saat load
  useEffect(() => {
    getKategoriSettings().then((res) => {
      if (res?.data) setKategoriList(res.data);
    }).catch(() => {
      setKategoriList([
        "Infrastruktur", "Lingkungan", "Air & Sanitasi", "Bencana",
        "Transportasi", "Pelayanan Publik", "Ekonomi", "Keamanan",
        "Pendidikan", "Kesehatan",
      ]);
    });
  }, []);

  const handleAdd = () => {
    if (newKategori.trim() && !kategoriList.includes(newKategori.trim())) {
      setKategoriList([...kategoriList, newKategori.trim()]);
      setNewKategori("");
    }
  };

  const handleRemove = (idx) => {
    if (window.confirm(`Hapus kategori "${kategoriList[idx]}"?`)) {
      setKategoriList(kategoriList.filter((_, i) => i !== idx));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateKategoriSettings(kategoriList);
      resetSettingsCache();
      alert("Kategori berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Kategori Laporan</h2>
      <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>Kelola kategori untuk klasifikasi laporan</p>

      <div className="flex gap-2 mb-5 max-w-xl">
        <input
          value={newKategori}
          onChange={(e) => setNewKategori(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Tambah kategori baru..."
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-raleway outline-none"
          style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }}
        />
        <button onClick={handleAdd} className="px-5 py-2.5 rounded-lg text-sm font-bold font-raleway text-white" style={{ background: "#3e8bf3" }}>
          Tambah
        </button>
      </div>

      <div className="flex flex-col gap-2 max-w-xl mb-6">
        {kategoriList.map((kat, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${inputBorder}` }}>
            <span className="text-sm font-semibold font-raleway" style={{ color: textPrimary }}>{kat}</span>
            <button onClick={() => handleRemove(i)} className="text-xs font-raleway text-red-500 hover:text-red-700 transition">Hapus</button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-lg text-sm font-bold font-raleway text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3e8bf3" }}
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </>
  );
}

function DinasTab({ dark, textPrimary, textSecondary, inputBg, inputBorder }) {
  const [dinasList, setDinasList] = useState([]);
  const [newNama, setNewNama] = useState("");
  const [newSingkatan, setNewSingkatan] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch dari API saat load
  useEffect(() => {
    getDinasSettings().then((res) => {
      if (res?.data) setDinasList(res.data);
    }).catch(() => {
      setDinasList([
        { nama: "Dinas Pekerjaan Umum", singkatan: "PUPR" },
        { nama: "Dinas Lingkungan Hidup", singkatan: "DLH" },
        { nama: "PDAM", singkatan: "PDAM" },
        { nama: "BPBD", singkatan: "BPBD" },
        { nama: "Dinas Perhubungan", singkatan: "Dishub" },
        { nama: "Dinas Kesehatan", singkatan: "Dinkes" },
        { nama: "Dinas Pendidikan", singkatan: "Disdik" },
        { nama: "Dinas Sosial", singkatan: "Dinsos" },
      ]);
    });
  }, []);

  const handleAdd = () => {
    if (newNama.trim()) {
      setDinasList([...dinasList, { nama: newNama.trim(), singkatan: newSingkatan.trim() || "-" }]);
      setNewNama("");
      setNewSingkatan("");
    }
  };

  const handleRemove = (idx) => {
    if (window.confirm(`Hapus "${dinasList[idx].nama}"?`)) {
      setDinasList(dinasList.filter((_, i) => i !== idx));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDinasSettings(dinasList);
      resetSettingsCache();
      alert("Daftar dinas berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan daftar dinas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Daftar Dinas</h2>
      <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>Kelola daftar dinas untuk disposisi laporan</p>

      <div className="flex gap-2 mb-5 max-w-xl">
        <input value={newNama} onChange={(e) => setNewNama(e.target.value)} placeholder="Nama dinas..."
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-raleway outline-none"
          style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
        <input value={newSingkatan} onChange={(e) => setNewSingkatan(e.target.value)} placeholder="Singkatan"
          className="w-28 px-4 py-2.5 rounded-lg text-sm font-raleway outline-none"
          style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
        <button onClick={handleAdd} className="px-5 py-2.5 rounded-lg text-sm font-bold font-raleway text-white" style={{ background: "#3e8bf3" }}>
          Tambah
        </button>
      </div>

      <div className="flex flex-col gap-2 max-w-xl mb-6">
        {dinasList.map((dinas, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${inputBorder}` }}>
            <div>
              <span className="text-sm font-semibold font-raleway" style={{ color: textPrimary }}>{dinas.nama}</span>
              <span className="text-xs font-raleway ml-2" style={{ color: textSecondary }}>({dinas.singkatan})</span>
            </div>
            <button onClick={() => handleRemove(i)} className="text-xs font-raleway text-red-500 hover:text-red-700 transition">Hapus</button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-lg text-sm font-bold font-raleway text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3e8bf3" }}
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </>
  );
}

function WilayahTab({ dark, textPrimary, textSecondary, inputBg, inputBorder }) {
  const [wilayahList, setWilayahList] = useState([]);
  const [newNama, setNewNama] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [newKecamatan, setNewKecamatan] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // untuk expand kecamatan

  const getToken = () => JSON.parse(localStorage.getItem("aduin_user"))?.token;

  useEffect(() => {
    fetch("http://localhost:3000/api/wilayah", {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()).then(res => { if (res.data) setWilayahList(res.data); });
  }, []);

  const handleAdd = async () => {
    if (!newNama.trim() || !newLat || !newLng) return alert("Nama, latitude, longitude wajib diisi");
    setSaving(true);
    try {
      const kecamatanArr = newKecamatan
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);

      const res = await fetch("http://localhost:3000/api/wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ nama: newNama, latitude: newLat, longitude: newLng, kecamatan: kecamatanArr }),
      });
      const data = await res.json();
      if (data.success) {
        setWilayahList([...wilayahList, data.data]);
        setNewNama(""); setNewLat(""); setNewLng(""); setNewKecamatan("");
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus wilayah ini?")) return;
    await fetch(`http://localhost:3000/api/wilayah/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setWilayahList(wilayahList.filter(w => w.id !== id));
  };

  const handleAddKecamatan = async (wilayah, kecBaru) => {
    if (!kecBaru.trim()) return;
    const updated = [...(wilayah.kecamatan || []), kecBaru.trim()];
    await fetch(`http://localhost:3000/api/wilayah/${wilayah.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ nama: wilayah.nama, latitude: wilayah.latitude, longitude: wilayah.longitude, kecamatan: updated }),
    });
    setWilayahList(wilayahList.map(w => w.id === wilayah.id ? { ...w, kecamatan: updated } : w));
  };

  const handleDeleteKecamatan = async (wilayah, kecIdx) => {
    const updated = wilayah.kecamatan.filter((_, i) => i !== kecIdx);
    await fetch(`http://localhost:3000/api/wilayah/${wilayah.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ nama: wilayah.nama, latitude: wilayah.latitude, longitude: wilayah.longitude, kecamatan: updated }),
    });
    setWilayahList(wilayahList.map(w => w.id === wilayah.id ? { ...w, kecamatan: updated } : w));
  };

  return (
    <>
      <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Wilayah & Koordinat</h2>
      <p className="text-sm font-raleway mb-6" style={{ color: textSecondary }}>
        Koordinat untuk heatmap. Kecamatan untuk dropdown form warga.
      </p>

      {/* Form tambah wilayah baru */}
      <div className="rounded-xl p-4 mb-6 max-w-2xl" style={{ background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${inputBorder}` }}>
        <p className="text-sm font-bold font-raleway mb-3" style={{ color: textPrimary }}>Tambah Wilayah Baru</p>
        <div className="flex gap-2 flex-wrap mb-2">
          <input value={newNama} onChange={(e) => setNewNama(e.target.value)} placeholder="Nama wilayah"
            className="flex-1 min-w-32 px-3 py-2 rounded-lg text-sm font-raleway outline-none"
            style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
          <input value={newLat} onChange={(e) => setNewLat(e.target.value)} placeholder="Latitude" type="number" step="0.0001"
            className="w-28 px-3 py-2 rounded-lg text-sm font-raleway outline-none"
            style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
          <input value={newLng} onChange={(e) => setNewLng(e.target.value)} placeholder="Longitude" type="number" step="0.0001"
            className="w-28 px-3 py-2 rounded-lg text-sm font-raleway outline-none"
            style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
        </div>
        <div className="flex gap-2 mb-1">
          <input value={newKecamatan} onChange={(e) => setNewKecamatan(e.target.value)}
            placeholder="Kecamatan (pisahkan dengan koma: Kec A, Kec B, Kec C)"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-raleway outline-none"
            style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }} />
          <button onClick={handleAdd} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold font-raleway text-white"
            style={{ background: "#3e8bf3" }}>
            {saving ? "..." : "Tambah"}
          </button>
        </div>
        <p className="text-xs font-raleway" style={{ color: textSecondary }}>
          Koordinat: cari di Google Maps → klik lokasi → salin lat,lng dari URL
        </p>
      </div>

      {/* List wilayah */}
      <div className="flex flex-col gap-3 max-w-2xl">
        {wilayahList.map((w) => (
          <div key={w.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${inputBorder}` }}>

            {/* Header wilayah */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: dark ? "#0f172a" : "#f8fafc" }}>
              <div>
                <span className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>{w.nama}</span>
                <span className="text-xs font-raleway ml-3" style={{ color: textSecondary }}>
                  {w.latitude}, {w.longitude}
                </span>
                <span className="text-xs font-raleway ml-2" style={{ color: textSecondary }}>
                  · {w.kecamatan?.length || 0} kecamatan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
                  className="text-xs font-bold font-raleway"
                  style={{ color: "#3e8bf3" }}
                >
                  {expandedId === w.id ? "Tutup" : "Edit Kecamatan"}
                </button>
                <button onClick={() => handleDelete(w.id)} className="text-xs font-raleway text-red-500 hover:text-red-700">
                  Hapus
                </button>
              </div>
            </div>

            {/* Expand kecamatan */}
            {expandedId === w.id && (
              <div className="px-4 py-3" style={{ background: dark ? "#1e293b" : "#fff", borderTop: `1px solid ${inputBorder}` }}>
                {/* List kecamatan */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(w.kecamatan || []).map((kec, i) => (
                    <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-raleway"
                      style={{ background: dark ? "#0f172a" : "#f1f5f9", color: textPrimary }}>
                      {kec}
                      <button onClick={() => handleDeleteKecamatan(w, i)} className="ml-1 text-red-400 hover:text-red-600 font-bold">×</button>
                    </div>
                  ))}
                  {(w.kecamatan || []).length === 0 && (
                    <p className="text-xs font-raleway italic" style={{ color: textSecondary }}>Belum ada kecamatan</p>
                  )}
                </div>

                {/* Tambah kecamatan */}
                <AddKecamatanInline
                  onAdd={(kec) => handleAddKecamatan(w, kec)}
                  dark={dark} inputBg={inputBg} inputBorder={inputBorder} textPrimary={textPrimary}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// Komponen kecil untuk input kecamatan baru
function AddKecamatanInline({ onAdd, dark, inputBg, inputBorder, textPrimary }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { onAdd(value); setValue(""); } }}
        placeholder="Tambah kecamatan..."
        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-raleway outline-none"
        style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: textPrimary }}
      />
      <button
        onClick={() => { onAdd(value); setValue(""); }}
        className="px-3 py-1.5 rounded-lg text-xs font-bold font-raleway text-white"
        style={{ background: "#3e8bf3" }}
      >
        + Tambah
      </button>
    </div>
  );
}