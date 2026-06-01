import React from 'react';
import HeaderWarga from '../components/common/HeaderWarga';
import FooterWarga from '../components/common/FooterWarga';
import CekStatusWarga from '../components/warga/CekStatus';

export default function CekStatusPage() {
  return (
    <div className="w-full min-h-screen bg-aduin-bg flex flex-col">
      <HeaderWarga />
      <div className='flex-grow'>
        <CekStatusWarga />
      </div>
      <FooterWarga />
    </div>
  );
}