import React from 'react';
import { VeironLogo } from './logos/VeironLogo';
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import { ArrowUpRight, Inbox, LogIn, ShieldCheck } from 'lucide-react';
import { AsciiLoader } from './AsciiLoader';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenInbox: () => void;
  isTransitioning?: boolean;
  transitionLabel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate,
  onOpenInbox,
  isTransitioning = false,
  transitionLabel = 'RESOLVING RECURSIVE STATE...'
}) => {
  const { isAuthenticated, currentUser, unreadCount } = useAuth();

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

          {/* Center: Dynamic ASCII Loading Animation during transitions */}
          <div className="hidden md:flex items-center justify-center min-w-[260px]">
            {isTransitioning && (
              <AsciiLoader
                variant="inline"
                label={transitionLabel}
                durationMs={450}
              />
            )}
          </div>

          {/* Right Action: User Profile, Inbox, Sign In & Contact Us */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                {/* Direct link to Beta Testing Workspace */}
                <button
                  onClick={() => onNavigate('beta-dashboard')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full border transition-all cursor-pointer ${
                    currentPage === 'beta-dashboard'
                      ? 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#141413] border-[#E3E0D8]'
                  }`}
                  title="Beta Testing Workspace"
                >
                  <ShieldCheck size={13} className="text-[#E5182B]" />
                  <span>Workspace</span>
                </button>

                {/* Inbox Button */}
                <button
                  onClick={onOpenInbox}
                  className="relative p-2 text-[#474540] hover:text-[#141413] hover:bg-[#E3E0D8]/40 rounded-full transition-colors cursor-pointer"
                  title="Open Institutional Inbox (Approvals & Dispatches)"
                  aria-label="Open Inbox"
                >
                  <Inbox size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E5182B] text-white text-[10px] font-mono font-bold flex items-center justify-center rounded-full shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Pill Dropdown */}
                <ProfileDropdown 
                  onNavigate={onNavigate} 
                  onOpenInbox={onOpenInbox} 
                />
              </>
            ) : (
              /* Sign In / Register Button */
              <button
                onClick={() => onNavigate('auth')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  currentPage === 'auth'
                    ? 'bg-[#141413] text-white border-[#141413]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#141413] border-[#E3E0D8] hover:border-[#141413]'
                }`}
                title="Sign In or Opt-in for Beta Testing"
              >
                <LogIn size={13} className="text-[#E5182B]" />
                <span>Beta Sign In</span>
              </button>
            )}

            {/* Contact Us CTA */}
            <button
              onClick={() => onNavigate('contact')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
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
