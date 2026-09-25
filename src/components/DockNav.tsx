import React from 'react';
import { Page } from '../types';
import { 
  Globe, 
  Activity, 
  Compass, 
  Layers, 
  Boxes, 
  BookOpen, 
  Mail, 
  ArrowUpRight 
} from 'lucide-react';

interface DockNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const DockNav: React.FC<DockNavProps> = ({ currentPage, onNavigate }) => {
  const items: { id: Page; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Overview', icon: Globe },
    { id: 'aakashavani', label: 'Aakashavani', icon: Activity, badge: '0.1' },
    { id: 'approach', label: 'Approach', icon: Compass },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'applications', label: 'Applications', icon: Boxes },
    { id: 'about', label: 'About', icon: BookOpen },
  ];

  return (
    <aside 
      aria-label="Application Dock Navigation"
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[98vw] sm:max-w-fit select-none"
    >
      <nav className="relative bg-[#141413]/94 backdrop-blur-2xl border border-[#2F2E2B] shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)] rounded-full p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 transition-all">
        {/* Core Pages Dock Links */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2A2926] text-white shadow-inner font-semibold'
                    : 'text-[#A19F97] hover:text-white hover:bg-[#201F1D]'
                }`}
                title={item.label}
              >
                <Icon size={14} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#E5182B]' : 'text-[#87857F] group-hover:text-white'}`} />
                <span className="text-[11px] sm:text-xs tracking-tight">{item.label}</span>

                {item.badge && (
                  <span className="hidden md:inline-block font-mono text-[9px] px-1 py-0.2 bg-[#E5182B]/20 text-[#FF4D5E] border border-[#E5182B]/30 rounded-full">
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#E5182B] rounded-full shadow-[0_0_6px_#E5182B]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Divider hairline */}
        <div className="w-[1px] h-5 bg-[#33322E] mx-0.5 sm:mx-1 shrink-0" />

        {/* HIGHLIGHTED CONTACT US BUTTON */}
        <button
          onClick={() => onNavigate('contact')}
          className={`shrink-0 relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shadow-lg ${
            currentPage === 'contact'
              ? 'bg-[#E5182B] text-white ring-2 ring-white/40 shadow-[0_0_20px_rgba(229,24,43,0.6)] scale-105'
              : 'bg-[#E5182B] text-white hover:bg-[#FF2A3D] hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(229,24,43,0.35)]'
          }`}
          title="Contact Us / Institutional Briefing"
        >
          {/* Pulsing Signal Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>

          <span className="font-sans font-bold text-[11px] sm:text-xs text-white">Contact Us</span>
          <ArrowUpRight size={13} className="shrink-0 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </nav>
    </aside>
  );
};
