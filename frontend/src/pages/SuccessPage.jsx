import React from 'react';
import HeaderWarga from '../components/common/HeaderWarga';
import FooterWarga from '../components/common/FooterWarga';
import SuccessPageWarga from '../components/warga/SuccessPage';

export default function SuccessPage() {
  return (
    <div className="w-full min-h-screen bg-aduin-bg flex flex-col">
      <HeaderWarga />
        <div className='flex-grow flex items-center justify-center'>
            <SuccessPageWarga />
        </div>
        <FooterWarga />
    </div>
  );
}