import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || "https://aduin-production.up.railway.app/api";

const FormLaporan = () => {
  const navigate = useNavigate();

  const [wilayahData, setWilayahData] = useState({});
  const [loadingWilayah, setLoadingWilayah] = useState(true);

  const [keluhan, setKeluhan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [detailLokasi, setDetailLokasi] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [isAnonim, setIsAnonim] = useState(false);
  const [fotoBukti, setFotoBukti] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Fetch wilayah dari backend
  useEffect(() => {
    fetch(`${API_URL}/wilayah/public`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          const mapped = {};
          res.data.forEach((w) => {
            mapped[w.nama] = w.kecamatan || [];
          });
          setWilayahData(mapped);
        }
      })
      .catch(() => {
        setWilayahData({
          "Denpasar": ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"],
          "Badung": ["Abiansemal", "Kuta", "Kuta Selatan", "Kuta Utara", "Mengwi", "Petang"],
          "Gianyar": ["Blahbatuh", "Gianyar", "Payangan", "Sukawati", "Tampaksiring", "Tegallalang", "Ubud"],
          "Tabanan": ["Baturiti", "Kediri", "Kerambitan", "Marga", "Penebel", "Pupuan", "Selemadeg", "Tabanan"],
          "Karangasem": ["Abang", "Bebandem", "Karangasem", "Kubu", "Manggis", "Rendang", "Selat", "Sidemen"],
          "Buleleng": ["Banjar", "Buleleng", "Gerokgak", "Kubutambahan", "Sawan", "Seririt", "Sukasada", "Tejakula"],
          "Klungkung": ["Banjarangkan", "Dawan", "Klungkung", "Nusa Penida"],
          "Bangli": ["Bangli", "Kintamani", "Susut", "Tembuku"],
          "Jembrana": ["Jembrana", "Melaya", "Mendoyo", "Negara", "Pekutatan"],
        });
      })
      .finally(() => setLoadingWilayah(false));
  }, []);

  const handleKabupatenChange = (e) => {
    setKabupaten(e.target.value);
    setKecamatan('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFotoBukti(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file) {
      alert("Ukuran file maksimal 5MB!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let photoUrls = [];
      if (fotoBukti) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(fotoBukti);
        });
        photoUrls = [base64];
      }
      const res = await createReport({
        text: keluhan,
        kabupatenKota: kabupaten,
        kecamatan,
        detailLokasi: detailLokasi || null,
        reporterName: isAnonim ? null : (namaLengkap || null),
        photoUrls,
      });
      navigate(`/lapor/sukses/${res.data.reportNumber}`);
    } catch (err) {
      setError("Gagal mengirim laporan. Pastikan koneksi internet dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-aduin-bg min-h-screen font-inter text-aduin-navy selection:bg-aduin-blue/20">
      <main className="container mx-auto py-12 px-4 max-w-3xl">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-raleway tracking-tight text-aduin-navy mb-2">Formulir Pengaduan</h1>
          <p className="text-gray-500 text-sm md:text-base font-pridi">Sampaikan keluhan Anda. Pantau progressnya.</p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Keluhan */}
            <div>
              <label className="block text-sm font-bold font-raleway text-aduin-navy mb-2">Keluhan Anda <span className="text-aduin-red text-lg">*</span></label>
              <textarea required rows={5} value={keluhan} onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Contoh: Jalan di depan SD rusak parah.."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none transition resize-none text-sm md:text-base font-raleway" />
            </div>

            {/* Kabupaten + Kecamatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold font-raleway text-aduin-navy mb-2">Kabupaten/Kota <span className="text-aduin-red text-lg">*</span></label>
                <select required value={kabupaten} onChange={handleKabupatenChange}
                  disabled={loadingWilayah}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none bg-white text-sm md:text-base font-raleway font-bold appearance-none disabled:opacity-60"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23021d54\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em', backgroundRepeat: 'no-repeat' }}>
                  <option value="" disabled hidden>
                    {loadingWilayah ? "Memuat wilayah..." : "Pilih Kabupaten/Kota"}
                  </option>
                  {Object.keys(wilayahData).map((kab) => (
                    <option key={kab} value={kab}>{kab}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold font-raleway text-aduin-navy mb-2">Kecamatan <span className="text-aduin-red text-lg">*</span></label>
                <select required disabled={!kabupaten || loadingWilayah} value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 outline-none bg-white text-sm font-raleway font-bold md:text-base appearance-none ${!kabupaten ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23021d54\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em', backgroundRepeat: 'no-repeat' }}>
                  <option value="" disabled hidden>Pilih Kecamatan</option>
                  {kabupaten && (wilayahData[kabupaten] || []).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detail Lokasi */}
            <div>
              <label className="block text-sm font-bold font-raleway text-aduin-navy mb-2">Detail Lokasi <span className="text-aduin-red text-lg">*</span></label>
              <input required type="text" value={detailLokasi} onChange={(e) => setDetailLokasi(e.target.value)}
                placeholder="Jl. Raya, dekat.."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-sm font-raleway md:text-base" />
            </div>

            {/* Nama Pelapor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold font-raleway text-aduin-navy">Nama Pelapor</label>
                <label className="flex items-center gap-2 text-xs md:text-sm font-raleway font-bold text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" checked={isAnonim} onChange={(e) => {
                    setIsAnonim(e.target.checked);
                    if (e.target.checked) setNamaLengkap('Anonim'); else setNamaLengkap('');
                  }} className="rounded text-aduin-blue h-4 w-4" />
                  Kirim sebagai Anonim
                </label>
              </div>
              <input required type="text" disabled={isAnonim} value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Masukkan nama pelapor"
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-raleway text-sm md:text-base ${isAnonim ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`} />
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-bold font-raleway text-aduin-navy mb-2">Upload Bukti Foto (Opsional)</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 hover:border-aduin-blue/50 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-aduin-blue/5 transition flex flex-col items-center justify-center min-h-[160px]">
                {previewUrl ? (
                  <div className="relative w-full max-h-48 overflow-hidden rounded-xl flex justify-center">
                    <img src={previewUrl} alt="Preview" className="object-cover max-h-44 rounded-xl" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFotoBukti(null); setPreviewUrl(null); }}
                      className="absolute top-2 right-2 bg-aduin-red text-white p-1.5 rounded-full shadow">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="h-10 w-10 text-aduin-blue mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-bold font-raleway text-aduin-navy mb-1">Klik untuk unggah foto bukti</p>
                    <p className="text-xs text-gray-400">Format: JPG, PNG (Maks. 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm font-raleway text-red-500 -mt-2">{error}</p>}

            {/* Submit */}
            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full bg-aduin-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-aduin-blue/90 transition shadow-lg shadow-aduin-blue/20 text-sm md:text-base font-inter disabled:opacity-50">
                <svg className="h-5 w-5 rotate-45 transform -translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {loading ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default FormLaporan;