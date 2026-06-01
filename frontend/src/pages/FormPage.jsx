import React from 'react';
import HeaderWarga from '../components/common/HeaderWarga';
import FooterWarga from '../components/common/FooterWarga';
import FormLaporan from '../components/warga/FormLaporan';

export default function FormPage() {
  return (
    <div className="w-full min-h-screen bg-aduin-bg flex flex-col">
      <HeaderWarga />
      <div className='flex-grow'>
        <FormLaporan />
      </div>
      <FooterWarga />
    </div>
  );
}