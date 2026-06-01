import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackReport } from '../../services/api';

export default function CekStatusWarga() {
  const [keyword, setKeyword] = useState('');
  const [laporanDitemukan, setLaporanDitemukan] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await trackReport(keyword.trim());
      const r = res.data;

      setLaporanDitemukan({
        id: r.reportNumber,
        text: r.text,
        status: r.status === "DITERIMA" || r.status === "DIANALISIS" ? "Belum"
          : r.status === "SELESAI" ? "Selesai"
          : "Proses",
        disposisi: r.disposisiDinas || null,
        catatan: r.catatanAdmin || null,
        photos: r.photoUrls?.length > 0 ? r.photoUrls : [null],
        pelapor: {
          tanggal: new Date(r.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
        },
        analisis: {
          kategori: {
            label: r.categories?.[0] || "Belum dianalisis",
            color: "#3e8bf3",
            bg: "rgba(62,139,243,0.2)",
          },
          urgensi: {
            label: r.urgensi === "tinggi" ? "Tinggi" : r.urgensi === "sedang" ? "Sedang" : r.urgensi === "rendah" ? "Rendah" : "Belum dianalisis",
            color: r.urgensi === "tinggi" ? "#ff0000" : r.urgensi === "sedang" ? "#eb7600" : "#1a8c3c",
            bg: r.urgensi === "tinggi" ? "rgba(255,0,0,0.2)" : r.urgensi === "sedang" ? "rgba(235,118,0,0.2)" : "rgba(26,140,60,0.2)",
          },
          lokasi: {
            label: r.kecamatan && r.kabupatenKota ? `${r.kecamatan}, ${r.kabupatenKota}` : "-",
            color: "#1a8c3c",
            bg: "rgba(26,140,60,0.2)",
          },
        },
      });
    } catch {
      setLaporanDitemukan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-aduin-bg min-h-screen font-inter text-aduin-navy selection:bg-aduin-blue/20 pb-16">

      {/* FORM PENCARIAN */}
      <section className="container mx-auto pt-12 px-4 max-w-4xl text-center">
        <h1 className="text-3xl md:text-4xl font-raleway font-bold tracking-tight text-aduin-navy mb-2">Lacak Pengaduan Anda</h1>
        <p className="text-gray-500 text-sm md:text-base mb-8 max-w-2xl mx-auto font-raleway font-bold">
          Pantau status laporan Anda secara real-time. Masukkan kode unik pengaduan Anda.
        </p>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Masukkan Kode (Contoh: ADN-20260601-1234)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 font-raleway font-bold outline-none text-sm md:text-base" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-aduin-blue text-white px-6 py-3.5 rounded-xl font-bold font-inter hover:bg-aduin-blue/90 transition text-sm md:text-base shadow-md shadow-aduin-blue/10 disabled:opacity-50">
              {loading ? "Mencari..." : "Cari Laporan"}
            </button>
          </form>
        </div>
      </section>

      {/* KONDISI SEBELUM CARI */}
      {!hasSearched && (
        <section className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="bg-aduin-blue/10 text-aduin-blue w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="#3e8bf3" viewBox="0 0 24 24"><path d="M23,11a1,1,0,0,0-1,1,10.034,10.034,0,1,1-2.9-7.021A.862.862,0,0,1,19,5H16a1,1,0,0,0,0,2h3a3,3,0,0,0,3-3V1a1,1,0,0,0-2,0V3.065A11.994,11.994,0,1,0,24,12,1,1,0,0,0,23,11ZM12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-3 text-aduin-navy font-raleway">Pelacakan Real-Time</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-raleway font-bold">Setiap pembaruan status tercatat secara instan tanpa tunda.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="bg-aduin-blue/10 text-aduin-blue w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#3e8bf3" strokeWidth="1.5" strokeLinecap="round"><path d="M22,19H15a3,3,0,0,0-3,3h0V5a3,3,0,0,1,3-3h7Z"/><path d="M2,19H9a3,3,0,0,1,3,3h0V5A3,3,0,0,0,9,2H2Z"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-3 text-aduin-navy font-raleway">Keterbukaan Instansi</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-raleway font-bold">Lihat dinas mana yang menangani laporan Anda.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="bg-aduin-blue/10 text-aduin-blue w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#3e8bf3" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-3 text-aduin-navy font-raleway">Analisis & Urgensi</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-raleway font-bold">Sistem mengelompokkan keluhan berdasarkan tingkat kedaruratan.</p>
          </div>
        </section>
      )}

      {/* DATA TIDAK KETEMU */}
      {hasSearched && !laporanDitemukan && !loading && (
        <section className="container mx-auto px-4 max-w-2xl text-center py-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 font-raleway">Data Laporan Tidak Ditemukan</h3>
            <p className="text-gray-500 text-sm mb-4 font-raleway font-bold">Pastikan kode pengaduan yang Anda masukkan sudah benar.</p>
          </div>
        </section>
      )}

      {/* DETAIL LAPORAN */}
      {hasSearched && laporanDitemukan && (
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6 mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-aduin-navy font-raleway">Detail Laporan #{laporanDitemukan.id}</h2>
            <p className="text-gray-500 text-sm font-pridi">Laporan Pengaduan Masyarakat</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* KOLOM KIRI */}
            <div className="lg:col-span-2 space-y-6">

              {/* Progress Tracker */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-8">KEMAJUAN LAPORAN</h3>
                <div className="relative flex justify-between items-center max-w-md mx-auto">
                  <div className="absolute left-0 right-0 top-5 h-1 bg-gray-100 -z-0"></div>
                  <div className="absolute left-0 top-5 h-1 bg-aduin-blue -z-0 transition-all duration-500" style={{
                    width: laporanDitemukan.status === "Selesai" ? '100%' : laporanDitemukan.status === "Proses" ? '50%' : '0%'
                  }}></div>

                  {/* Step 1 */}
                  <div className="z-10 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-aduin-blue text-white flex items-center justify-center font-bold shadow-md">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold mt-2 text-aduin-navy font-raleway">Pengajuan</span>
                  </div>

                  {/* Step 2 */}
                  <div className="z-10 text-center flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${laporanDitemukan.status === "Proses" || laporanDitemukan.status === "Selesai" ? 'bg-aduin-blue text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {laporanDitemukan.status === "Selesai"
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </div>
                    <span className={`text-xs font-bold mt-2 font-raleway ${laporanDitemukan.status === "Proses" || laporanDitemukan.status === "Selesai" ? 'text-aduin-blue' : 'text-gray-400'}`}>Diproses</span>
                  </div>

                  {/* Step 3 */}
                  <div className="z-10 text-center flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${laporanDitemukan.status === "Selesai" ? 'bg-aduin-blue text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {laporanDitemukan.status === "Selesai"
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </div>
                    <span className={`text-xs font-bold mt-2 font-raleway ${laporanDitemukan.status === "Selesai" ? 'text-aduin-navy' : 'text-gray-400'}`}>Selesai</span>
                  </div>
                </div>
              </div>

              {/* Disposisi */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-aduin-navy font-raleway">Disposisi Penanganan</span>
                  <span className="px-3 py-1 bg-aduin-blue/10 text-aduin-blue text-xs font-bold rounded-lg font-raleway">
                    Status: {laporanDitemukan.status}
                  </span>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    {laporanDitemukan.disposisi ? (
                        <blockquote className="border-l-4 border-aduin-blue pl-4 text-sm text-gray-600 leading-relaxed font-pridi">
                        Laporan telah diteruskan ke{" "}
                        <span className="text-aduin-blue font-semibold">{laporanDitemukan.disposisi}</span>.
                        </blockquote>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Laporan baru masuk, menunggu verifikasi admin.</p>
                    )}

                    {/* Catatan admin — tampil kalau ada */}
                    {laporanDitemukan.catatan && (
                        <div className="rounded-xl p-4" style={{ background: "rgba(62,139,243,0.05)", border: "1px solid rgba(62,139,243,0.15)" }}>
                        <p className="text-xs font-bold font-raleway uppercase tracking-wider mb-1.5" style={{ color: "#3e8bf3" }}>
                            Catatan dari Admin
                        </p>
                        <p className="text-sm font-raleway text-gray-600 leading-relaxed">
                            {laporanDitemukan.catatan}
                        </p>
                        </div>
                    )}

                    <p className="text-xs text-gray-500 font-raleway">
                        Tanggal Masuk: {laporanDitemukan.pelapor.tanggal}
                    </p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-extrabold text-lg border-b border-gray-200 pb-3 font-raleway">Ringkasan Pengaduan</h3>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Isi Keluhan</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-raleway font-bold">"{laporanDitemukan.text}"</p>
              </div>
              <div className="space-y-2 border-t border-b border-gray-100 py-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hasil Analisis Sistem</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold font-raleway" style={{ backgroundColor: laporanDitemukan.analisis.kategori.bg, color: laporanDitemukan.analisis.kategori.color }}>
                    {laporanDitemukan.analisis.kategori.label}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold font-raleway" style={{ backgroundColor: laporanDitemukan.analisis.urgensi.bg, color: laporanDitemukan.analisis.urgensi.color }}>
                    Urgensi: {laporanDitemukan.analisis.urgensi.label}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold font-raleway" style={{ backgroundColor: laporanDitemukan.analisis.lokasi.bg, color: laporanDitemukan.analisis.lokasi.color }}>
                    {laporanDitemukan.analisis.lokasi.label}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lampiran Foto Bukti</h4>
                {laporanDitemukan.photos[0] ? (
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={laporanDitemukan.photos[0]} alt="Bukti" className="w-full h-40 object-cover" />
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 text-gray-400 text-xs">
                    Tidak ada lampiran foto bukti.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}