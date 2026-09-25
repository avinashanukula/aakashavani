import React from 'react';
import { VeironLogo } from './logos/VeironLogo';
import { Page } from '../types';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E3E0D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none"
            >
              <VeironLogo size={32} showText={true} textColor="text-[#141413]" />
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#87857F] pl-3 border-l border-[#E3E0D8]">
              WORLD MODELS FOR INSTITUTIONS
            </span>
          </div>

          {/* Center: Live Institutional Telemetry State */}
          <div className="hidden md:flex items-center gap-2.5 font-mono text-[11px] text-[#66645E] bg-[#F0EEE6] px-3 py-1 rounded-full border border-[#E3E0D8]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5182B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5182B]" />
            </span>
            <span className="text-[#141413] font-medium">AKHVNI-0.1.2 :: CONTINUOUS ONLINE</span>
          </div>

          {/* Right Action: Highlighted Contact Us & Briefing CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
                currentPage === 'contact'
                  ? 'bg-[#FF2A3D] text-white shadow-[#E5182B]/30'
                  : 'bg-[#E5182B] hover:bg-[#FF2A3D] text-white shadow-md shadow-[#E5182B]/20 hover:scale-105 active:scale-95'
              }`}
            >
              <span>Contact Us</span>
              <ArrowUpRight size={14} className="opacity-90" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
