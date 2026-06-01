import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

export default function SuccessPageWarga() {
  // Ambil parameter id (kode pengaduan) dari URL
  const { id } = useParams();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(id);
    alert('Kode pengaduan berhasil disalin!');
  };

  // Fungsi untuk membuat dan mengunduh PDF secara instan
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
};

  return (
    <div className="bg-aduin-bg min-h-screen flex items-center justify-center p-4 font-inter text-aduin-navy">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl w-full p-8 md:p-12 text-center">
        
        {/* Icon Check Green */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6">
          <svg className="h-12 w-12 text-aduin-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-raleway font-bold text-aduin-navy mb-3">Laporan Berhasil Dikirim!</h2>
        <p className="text-gray-500 font-raleway font-bold text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Terima kasih atas partisipasi Anda. Laporan Anda telah kami terima.
        </p>
        
        {/* Box Kode Pengaduan */}
        <div className="bg-aduin-blue/5 border border-aduin-blue/20 rounded-2xl p-6 mb-6">
          <p className="text-xs font-inter text-aduin-blue font-bold tracking-wider uppercase mb-2">KODE PENGADUAN</p>
          <p className="text-3xl md:text-4xl font-black text-aduin-navy tracking-wide">{id || 'PRD-2026-0000'}</p>
        </div>
        
        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button 
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-aduin-blue/30 text-aduin-blue rounded-xl font-bold font-inter hover:bg-aduin-blue/5 transition"
          >
            Salin Kode
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-aduin-blue text-white rounded-xl font-bold hover:bg-aduin-blue/90 transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Kode Pengaduan
          </button>
        </div>
        
        {/* Warning Info Box */}
        <div className="bg-aduin-blue/5 border border-aduin-blue/10 p-5 rounded-xl text-left text-xs md:text-sm text-aduin-navy mb-8 flex items-start gap-3">
          <svg className="h-5 w-5 text-aduin-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className='font-raleway font-normal'><span className="font-extrabold font-raleway">Penting:</span> Simpan kode pengaduan ini dengan baik. Anda wajib menggunakan kode ini untuk memantau perkembangan laporan Anda melalui halaman <Link to="/cek-status" className="font-bold underline text-aduin-blue">Lacak</Link>.</p>
        </div>
        
        <Link to="/lapor" className="text-gray-400 hover:text-aduin-navy transition flex items-center justify-center gap-2 text-sm font-semibold">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali ke Formulir
        </Link>
      </div>
    </div>
  );
}