import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoAduin from '../../assets/icons/logo.svg';

export default function HeaderWarga() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 font-inter sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/lapor">
                <img 
                    src={ logoAduin }
                    alt="Logo Aduin"
                    className="w-auto h-8" 
                />
            </Link>
            </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/lapor" 
              className={`text-sm font-raleway font-bold tracking-wide transition-all duration-200 pb-2 border-b-2 ${
                isActive('/lapor') || location.pathname.includes('/lapor/sukses')
                  ? 'text-aduin-blue border-aduin-blue' 
                  : 'text-gray-500 border-transparent hover:text-aduin-navy'
              }`}
            >
              Formulir
            </Link>
            <Link 
              to="/cek-status" 
              className={`text-sm font-raleway font-bold tracking-wide transition-all duration-200 pb-2 border-b-2 ${
                isActive('/cek-status') 
                  ? 'text-aduin-blue border-aduin-blue' 
                  : 'text-gray-500 border-transparent hover:text-aduin-navy'
              }`}
            >
              Lacak
            </Link>
          </div>

          {/* TOMBOL HAMBURGER (Tampilan Mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-aduin-blue hover:bg-gray-50 focus:outline-none transition"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                // Icon Close saat menu terbuka
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Icon Hamburger saat menu tertutup
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200 shadow-inner`} id="mobile-menu">
        <div className="px-4 pt-3 pb-4 space-y-2">
          <Link
            to="/lapor"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold font-raleway transition ${
              isActive('/lapor') || location.pathname.includes('/lapor/sukses')
                ? 'bg-aduin-blue/5 text-aduin-blue'
                : 'text-gray-600 hover:bg-gray-50 hover:text-aduin-navy'
            }`}
          >
            Formulir
          </Link>
          <Link
            to="/cek-status"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold font-raleway transition ${
              isActive('/cek-status')
                ? 'bg-aduin-blue/5 text-aduin-blue'
                : 'text-gray-600 hover:bg-gray-50 hover:text-aduin-navy'
            }`}
          >
            Lacak
          </Link>
        </div>
      </div>
    </nav>
  );
}