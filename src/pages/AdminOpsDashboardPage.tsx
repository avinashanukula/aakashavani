import React, { useState, useEffect } from 'react';
import { Page, AdminUserRecord, InboxMessage, BetaReview } from '../types';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Mail, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Send, 
  Search, 
  Filter, 
  AlertCircle,
  Key,
  Building2,
  Clock,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface AdminOpsDashboardPageProps {
  onNavigate: (page: Page) => void;
}

const DEFAULT_ADMIN_PASSKEY = 'VEIRON-ALPHA-ROOT-2026';
const ADMIN_STORAGE_KEY = 'veiron_admin_passkey_session';

export const AdminOpsDashboardPage: React.FC<AdminOpsDashboardPageProps> = ({ onNavigate }) => {
  const { addToast } = useAuth();

  // Authentication State for Admin Console
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) || '';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'users' | 'mailbox' | 'reviews'
  const [activeTab, setActiveTab] = useState<'users' | 'mailbox' | 'reviews'>('users');

  // Data States
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [reviews, setReviews] = useState<BetaReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // User Filter State
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Reply Modal / State
  const [replyTargetEmail, setReplyTargetEmail] = useState<string | null>(null);
  const [replyParentId, setReplyParentId] = useState<string | undefined>(undefined);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Verify stored passkey on initial load
  useEffect(() => {
    if (adminKey) {
      verifyAndLoadData(adminKey);
    }
  }, [adminKey]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const keyToTest = passkeyInput.trim();

    if (!keyToTest) {
      setAuthError('Master clearance passkey is required.');
      return;
    }

    await verifyAndLoadData(keyToTest);
  };

  const verifyAndLoadData = async (key: string) => {
    setIsLoading(true);
    try {
      // Test the passkey by attempting to fetch users from the edge function
      const fetchedUsers = await supabaseService.adminFetchUsers(key);
      setUsers(fetchedUsers);
      setAdminKey(key);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, key);
      setIsUnlocked(true);

      // Fetch other data
      const [fetchedMessages, fetchedReviews] = await Promise.all([
        supabaseService.adminFetchMessages(key).catch(() => []),
        supabaseService.fetchBetaReviews().catch(() => [])
      ]);
      setMessages(fetchedMessages);
      setReviews(fetchedReviews);

      addToast('Admin Console Unlocked', 'Connected to Supabase administrative edge interface.', 'approval');
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid administrative passkey. Access denied.');
      setIsUnlocked(false);
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllData = async () => {
    if (!adminKey) return;
    setIsLoading(true);
    try {
      const [fetchedUsers, fetchedMessages, fetchedReviews] = await Promise.all([
        supabaseService.adminFetchUsers(adminKey),
        supabaseService.adminFetchMessages(adminKey),
        supabaseService.fetchBetaReviews()
      ]);
      setUsers(fetchedUsers);
      setMessages(fetchedMessages);
      setReviews(fetchedReviews);
      addToast('Data Refreshed', 'Synced latest records from Supabase.', 'system');
    } catch (err: any) {
      addToast('Refresh Failed', err?.message || 'Error communicating with Supabase.', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Approve / Reject
  const handleUpdateStatus = async (userId: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    try {
      const res = await supabaseService.adminUpdateUserStatus(adminKey, userId, newStatus);
      addToast(
        newStatus === 'approved' ? 'Clearance Granted' : 'Status Updated',
        res.message || `Tester status updated to ${newStatus}.`,
        newStatus === 'approved' ? 'approval' : 'system'
      );
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, approval_status: newStatus } : u));
    } catch (err: any) {
      addToast('Update Failed', err?.message || 'Could not update status.', 'alert');
    }
  };

  // Dispatch Reply to Tester
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTargetEmail || !replyBody.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await supabaseService.adminReplyMessage(adminKey, {
        userEmail: replyTargetEmail,
        parentMessageId: replyParentId,
        replyBody: replyBody.trim(),
        subject: replySubject.trim() || undefined
      });
      addToast('Reply Dispatched', res.message || `Reply dispatched to ${replyTargetEmail}.`, 'success');
      setReplyTargetEmail(null);
      setReplyBody('');
      setReplySubject('');
      await refreshAllData();
    } catch (err: any) {
      addToast('Dispatch Error', err?.message || 'Failed to send reply.', 'alert');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setAdminKey('');
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    addToast('Admin Session Locked', 'Administrative credentials cleared.', 'alert');
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesStatus = userStatusFilter === 'all' || u.approval_status === userStatusFilter;
    const matchesSearch = !userSearchTerm.trim() || 
      u.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.clearance_code.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.institution && u.institution.toLowerCase().includes(userSearchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = users.filter(u => u.approval_status === 'pending').length;

  // =========================================================================
  // VIEW 1: LOCKED PASSKEY GATE
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-[#141413] shadow-2xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 bg-[#141413] text-white mx-auto flex items-center justify-center">
              <Lock size={22} className="text-[#E5182B]" />
            </div>
            <div className="font-mono text-xs text-[#E5182B] uppercase tracking-wider font-semibold">
              HASHED RESTRICTED ENDPOINT · VEIRON OPS
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#141413]">
              Administrative Control Room
            </h2>
            <p className="text-xs text-[#66645E]">
              Enter the master administrative passkey to review applicants, manually grant Supabase clearance, and dispatch letters.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#141413]">
                ADMIN CLEARANCE PASSKEY
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey (e.g. VEIRON-ALPHA-ROOT-2026)"
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413]"
              />
              <div className="text-[10px] font-mono text-[#87857F]">
                Default demo passkey: <code className="text-[#141413] font-bold">VEIRON-ALPHA-ROOT-2026</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#141413] hover:bg-[#2B2A28] disabled:opacity-50 text-white font-semibold text-xs rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <span>AUTHENTICATING SECURE CHANNEL...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authenticate Admin Gateway</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#87857F] hover:text-[#141413] font-mono cursor-pointer"
            >
              ← Return to Public Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: UNLOCKED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E3E0D8]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E3E0D8]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#E5182B] font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>VEIRON SECURE ADMIN OPS · HASHED ROUTE GATEWAY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#141413] tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-xs text-[#66645E]">
              Manually review & approve beta applicants in Supabase, reply to institutional inquiries, and audit evaluation telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshAllData}
              disabled={isLoading}
              className="px-4 py-2 bg-white hover:bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono font-medium rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#E5182B]' : 'text-[#87857F]'} />
              <span>Refresh Records</span>
            </button>

            <button
              onClick={handleLock}
              className="px-4 py-2 bg-[#141413] hover:bg-[#2B2A28] text-white text-xs font-mono font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogOut size={13} />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#E3E0D8] space-y-1">
            <div className="text-[10px] font-mono text-[#87857F] uppercase">TOTAL REGISTERED TESTERS</div>
            <div className="text-2xl font-serif font-bold text-[#141413]">{users.length}</div>
          </div>
          <div className="p-4 bg-white border-2 border-amber-500 bg-amber-50/20 space-y-1">
            <div className="text-[10px] font-mono text-amber-800 uppercase font-semibold">PENDING SUPABASE APPROVAL</div>
            <div className="text-2xl font-serif font-bold text-amber-900">{pendingCount}</div>
          </div>
          <div className="p-4 bg-white border border-[#E3E0D8] space-y-1">
            <div className="text-[10px] font-mono text-[#87857F] uppercase">TESTER INQUIRIES & MAILS</div>
            <div className="text-2xl font-serif font-bold text-[#141413]">{messages.length}</div>
          </div>
          <div className="p-4 bg-white border border-[#E3E0D8] space-y-1">
            <div className="text-[10px] font-mono text-[#87857F] uppercase">BETA EVALUATIONS & REVIEWS</div>
            <div className="text-2xl font-serif font-bold text-[#141413]">{reviews.length}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3E0D8] space-x-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'users'
                ? 'border-[#E5182B] text-[#141413]'
                : 'border-transparent text-[#87857F] hover:text-[#141413]'
            }`}
          >
            <Users size={14} />
            <span>Applicant Clearance ({users.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mailbox')}
            className={`pb-3 px-4 text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'mailbox'
                ? 'border-[#E5182B] text-[#141413]'
                : 'border-transparent text-[#87857F] hover:text-[#141413]'
            }`}
          >
            <Mail size={14} />
            <span>Tester Mailbox & Replies ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#E5182B] text-[#141413]'
                : 'border-transparent text-[#87857F] hover:text-[#141413]'
            }`}
          >
            <Star size={14} />
            <span>Beta Reviews & Feedback ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS & CLEARANCE APPROVALS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-[#E3E0D8]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#87857F]">Filter Status:</span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setUserStatusFilter(s)}
                    className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                      userStatusFilter === s
                        ? 'bg-[#141413] text-white'
                        : 'bg-[#FAF8F5] text-[#474540] hover:bg-[#EAE6DD]'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search name, email, clearance..."
                  className="pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413] w-64"
                />
                <Search size={13} className="absolute left-2.5 top-2 text-[#87857F]" />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E3E0D8] overflow-x-auto shadow-sm">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E3E0D8] font-mono text-[#4F4D47]">
                  <tr>
                    <th className="p-3.5">APPLICANT</th>
                    <th className="p-3.5">INSTITUTION</th>
                    <th className="p-3.5">ROLE & CLEARANCE</th>
                    <th className="p-3.5">REGISTERED</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">MANUAL APPROVAL ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E0D8]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#87857F] font-mono">
                        No applicants found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-semibold text-[#141413]">{u.full_name}</div>
                          <div className="font-mono text-[11px] text-[#66645E]">{u.email}</div>
                          <div className="font-mono text-[10px] text-[#87857F]">{u.phone}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[#474540]">
                          {u.institution || 'Institutional Desk'}
                        </td>
                        <td className="p-3.5 font-mono">
                          <div className="font-bold text-[#141413]">{u.role}</div>
                          <div className="text-[11px] text-[#E5182B]">{u.clearance_code}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-[#87857F]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 font-mono">
                          {u.approval_status === 'approved' && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                              APPROVED
                            </span>
                          )}
                          {u.approval_status === 'pending' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-300">
                              PENDING APPROVAL
                            </span>
                          )}
                          {u.approval_status === 'rejected' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-semibold border border-red-300">
                              REJECTED
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2 font-mono text-[11px]">
                            {u.approval_status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(u.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                                title="Approve clearance and unlock live preview desk"
                              >
                                <CheckCircle2 size={12} />
                                <span>Approve Clearance</span>
                              </button>
                            )}

                            {u.approval_status === 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(u.id, 'pending')}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors cursor-pointer flex items-center gap-1"
                                title="Put user back into pending status"
                              >
                                <Lock size={12} />
                                <span>Revoke / Hold</span>
                              </button>
                            )}

                            {u.approval_status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(u.id, 'rejected')}
                                className="px-2 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded transition-colors cursor-pointer"
                                title="Reject application"
                              >
                                Reject
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setReplyTargetEmail(u.email);
                                setReplySubject(`Institutional Clearance Inquiry — ${u.clearance_code}`);
                                setActiveTab('mailbox');
                              }}
                              className="px-2 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#474540] border border-[#E3E0D8] rounded transition-colors cursor-pointer"
                              title="Send letter or inquiry to user"
                            >
                              Message
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TESTER MAILBOX & REPLIES */}
        {activeTab === 'mailbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Messages Feed */}
            <div className="lg:col-span-7 bg-white border border-[#E3E0D8] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE6]">
                <h3 className="font-serif font-bold text-lg text-[#141413]">
                  Incoming Institutional Mails & Inquiries
                </h3>
                <span className="font-mono text-xs text-[#87857F]">
                  {messages.length} DISPATCHES
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="py-12 text-center text-[#87857F] font-mono text-xs">
                  No mailbox messages recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-[#F0EEE6] max-h-[600px] overflow-y-auto pr-1 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className="pt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#141413]">
                            {m.sender}
                          </span>
                          <span className="px-1.5 py-0.2 bg-[#FAF8F5] border border-[#E3E0D8] text-[9px] font-mono text-[#87857F] uppercase">
                            {m.category}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#87857F]">
                          {m.timestamp}
                        </span>
                      </div>

                      <div className="font-serif font-bold text-sm text-[#141413]">
                        {m.title}
                      </div>

                      <p className="text-xs text-[#4F4D47] whitespace-pre-wrap leading-relaxed">
                        {m.body}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#87857F]">
                          {m.clearanceCode ? `Clearance: ${m.clearanceCode}` : ''}
                        </span>
                        <button
                          onClick={() => {
                            setReplyTargetEmail(m.sender.includes('@') ? m.sender : (m as any).user_email || 'tester@firm.com');
                            setReplyParentId(m.id);
                            setReplySubject(`Re: ${m.title}`);
                          }}
                          className="px-2.5 py-1 bg-[#141413] hover:bg-[#2B2A28] text-white text-[11px] rounded transition-colors cursor-pointer"
                        >
                          Reply to this Letter →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Reply Form */}
            <div className="lg:col-span-5 bg-white border-2 border-[#141413] p-6 space-y-5 shadow-md">
              <div className="space-y-1 pb-3 border-b border-[#F0EEE6]">
                <div className="text-[10px] font-mono text-[#E5182B] uppercase tracking-wider font-semibold">
                  OFFICIAL CORRESPONDENCE DISPATCH
                </div>
                <h4 className="font-serif font-bold text-base text-[#141413]">
                  Dispatch Administrative Letter
                </h4>
                <p className="text-xs text-[#66645E]">
                  This letter will be delivered directly into the tester's portal mailbox in Supabase.
                </p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#141413]">
                    Recipient Institutional Email <span className="text-[#E5182B]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={replyTargetEmail || ''}
                    onChange={(e) => setReplyTargetEmail(e.target.value)}
                    placeholder="tester@fund.com"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#141413]">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="e.g. Response from Access Committee regarding clearance"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#141413]">
                    Official Letter Content <span className="text-[#E5182B]">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Type official communication, clearance terms, or answers to their inquiry..."
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingReply || !replyTargetEmail || !replyBody.trim()}
                  className="w-full py-3 bg-[#141413] hover:bg-[#2B2A28] disabled:opacity-50 text-white font-semibold text-xs rounded-none transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingReply ? (
                    <span>DISPATCHING LETTER...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Dispatch Official Letter to Mailbox</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: BETA REVIEWS & EVALUATIONS */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-[#E3E0D8] p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE6]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#141413]">
                  All Recorded Beta Evaluations & Feedback
                </h3>
                <p className="text-xs text-[#66645E]">
                  Submitted in real time by authorized beta testers from their workspaces.
                </p>
              </div>
              <span className="font-mono text-xs text-[#87857F]">
                {reviews.length} EVALUATIONS
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="py-12 text-center text-[#87857F] font-mono text-xs">
                No reviews or evaluations recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#FAF8F5] border border-[#E3E0D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-[#87857F]">
                        {new Date(rev.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#141413]">
                      {rev.title}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                      <span className="px-1.5 py-0.2 bg-white border border-[#E3E0D8] text-[#141413] font-semibold uppercase">
                        {rev.category}
                      </span>
                      <span className="text-[#87857F]">
                        By: <strong className="text-[#141413]">{rev.tester_name}</strong> ({rev.tester_email})
                      </span>
                      {rev.tester_institution && (
                        <span>· {rev.tester_institution}</span>
                      )}
                    </div>

                    <p className="text-xs text-[#474540] leading-relaxed pt-1">
                      {rev.commentary}
                    </p>

                    {rev.tested_scenario && (
                      <div className="p-2 bg-white border border-[#E3E0D8] font-mono text-[10px] text-[#66645E]">
                        Tested Scenario: <strong className="text-[#141413]">{rev.tested_scenario}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
