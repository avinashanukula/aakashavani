import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page, BetaRole } from '../types';
import { BETA_ROLES, getBetaRoleInfo } from '../data/betaRoles';
import { 
  User as UserIcon, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  Bell, 
  Phone, 
  Building2, 
  Mail, 
  Key, 
  Activity, 
  Check, 
  RefreshCw,
  ArrowUpRight 
} from 'lucide-react';

interface ProfileDropdownProps {
  onNavigate: (page: Page) => void;
  onOpenInbox: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onNavigate,
  onOpenInbox
}) => {
  const { 
    currentUser, 
    signOut, 
    updateUserRole, 
    notificationsEnabled, 
    turnOnNotifications,
    launchLiveBeta 
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowRoleSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const currentRoleInfo = getBetaRoleInfo(currentUser.role);

  // Initials for avatar
  const initials = currentUser.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'BT';

  const handleRoleChange = (roleId: BetaRole) => {
    updateUserRole(roleId);
    setShowRoleSelector(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Trigger Pill */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#E3E0D8] rounded-full transition-all duration-150 cursor-pointer shadow-sm group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="View Beta Profile & Credentials"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-[#141413] text-white flex items-center justify-center text-xs font-mono font-bold tracking-tight">
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#141413] leading-tight group-hover:text-[#E5182B] transition-colors">
            {currentUser.fullName}
          </span>
          <span className="text-[10px] font-mono text-[#87857F] leading-tight truncate max-w-[110px]">
            {currentRoleInfo.badge}
          </span>
        </div>

        <ChevronDown size={14} className={`text-[#87857F] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-[#141413] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-[#FAF8F5] border-b border-[#E3E0D8] space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#141413] text-[#FAF8F5] flex items-center justify-center text-sm font-mono font-bold">
                  {initials}
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#141413]">
                    {currentUser.fullName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#66645E]">
                    <Mail size={12} className="text-[#87857F]" />
                    <span className="truncate max-w-[180px]">{currentUser.email}</span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-300">
                ACTIVE BETA
              </span>
            </div>

            {/* Institutional Details */}
            <div className="bg-white border border-[#E3E0D8] p-2.5 text-xs space-y-1 font-mono text-[#4F4D47]">
              <div className="flex items-center gap-1.5 text-[#141413]">
                <Building2 size={13} className="text-[#87857F]" />
                <span className="font-semibold">{currentUser.institution || 'Institutional Desk'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#66645E]">
                <Phone size={13} className="text-[#87857F]" />
                <span>{currentUser.phone || '+1 (555) 234-8900'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#87857F] text-[11px] pt-1 border-t border-[#F0EEE6]">
                <Key size={12} className="text-[#E5182B]" />
                <span>CREDENTIAL: {currentUser.clearanceCode}</span>
              </div>
            </div>
          </div>

          {/* Role & Clearance Card */}
          <div className="p-4 space-y-3 border-b border-[#E3E0D8]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#87857F] uppercase tracking-wider">
                ACTIVE BETA TESTER ROLE
              </span>
              <button
                onClick={() => setShowRoleSelector(prev => !prev)}
                className="text-xs font-mono text-[#E5182B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={11} />
                <span>Switch Role</span>
              </button>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D8] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#141413]">
                  {currentRoleInfo.title}
                </span>
                <span className="px-1.5 py-0.5 bg-[#E5182B]/10 text-[#E5182B] text-[10px] font-mono font-semibold">
                  {currentRoleInfo.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#66645E] leading-relaxed">
                {currentRoleInfo.description}
              </p>
              <div className="text-[10px] font-mono text-[#87857F] pt-1">
                Tier: {currentRoleInfo.clearanceLevel}
              </div>
            </div>

            {/* Switch Role Submenu */}
            {showRoleSelector && (
              <div className="p-2 bg-[#FAF8F5] border border-[#141413] space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-[10px] font-mono text-[#87857F] uppercase pb-1 border-b border-[#E3E0D8]">
                  Select New Beta Role (Dispatches Approval Notice)
                </div>
                {BETA_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role.id)}
                    className={`w-full p-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      currentUser.role === role.id 
                        ? 'bg-[#141413] text-white' 
                        : 'hover:bg-white text-[#141413]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{role.title}</div>
                      <div className="text-[10px] font-mono opacity-80">{role.badge}</div>
                    </div>
                    {currentUser.role === role.id && <Check size={14} className="text-[#E5182B]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links & Settings */}
          <div className="p-3 space-y-1 border-b border-[#E3E0D8] text-xs">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenInbox();
              }}
              className="w-full px-3 py-2 text-left text-[#141413] hover:bg-[#FAF8F5] rounded flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#E5182B]" />
                <span className="font-medium">Open Inbox (Approvals & Letters)</span>
              </div>
              <span className="text-[10px] font-mono text-[#87857F]">VIEW</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                launchLiveBeta(onNavigate);
              }}
              className="w-full px-3 py-2 text-left text-[#141413] hover:bg-[#FAF8F5] rounded flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#E5182B]" />
                <span className="font-medium">Preview Beta Version Console</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#87857F]">
                <span>LIVE</span>
                <ArrowUpRight size={11} />
              </div>
            </button>

            <div className="px-3 py-2 flex items-center justify-between text-[#474540]">
              <div className="flex items-center gap-2">
                <Bell size={14} className={notificationsEnabled ? 'text-emerald-600' : 'text-[#87857F]'} />
                <span>Notifications:</span>
              </div>
              {notificationsEnabled ? (
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">ENABLED</span>
              ) : (
                <button
                  onClick={() => turnOnNotifications()}
                  className="text-[#E5182B] hover:underline font-mono text-[11px] font-semibold cursor-pointer"
                >
                  Turn On
                </button>
              )}
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="p-3 bg-[#FAF8F5]">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full py-2 px-3 text-left text-xs text-[#E5182B] hover:bg-[#E5182B]/10 rounded flex items-center gap-2 transition-colors cursor-pointer font-medium"
            >
              <LogOut size={14} />
              <span>Sign Out of Beta Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
