import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page, InboxMessage, BetaRole } from '../types';
import { BETA_ROLES, getBetaRoleInfo } from '../data/betaRoles';
import { supabaseService } from '../services/supabaseService';
import { 
  Inbox, 
  X, 
  CheckCheck, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Trash2, 
  Clock, 
  Key, 
  FileText,
  Mail,
  ChevronRight,
  Reply,
  Send,
  PlusCircle,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { 
    inboxMessages, 
    unreadCount, 
    markMessageAsRead, 
    markAllMessagesAsRead, 
    deleteMessage,
    sendReplyMessage,
    postInquiryMessage,
    refreshMailbox,
    sessionToken,
    currentUser,
    launchLiveBeta 
  } = useAuth();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'approval' | 'system'>('all');
  
  // Reply State
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Compose State
  const [isComposing, setIsComposing] = useState(false);
  const [composeTitle, setComposeTitle] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isPostingInquiry, setIsPostingInquiry] = useState(false);

  // Approval Tool State (Review and Approve Tester Requests)
  const [showApprovalTool, setShowApprovalTool] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState('');
  const [approvalRole, setApprovalRole] = useState<BetaRole>('quant-researcher');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const filteredMessages = inboxMessages.filter(msg => {
    if (activeFilter === 'all') return true;
    return msg.category === activeFilter;
  });

  const activeMessage = inboxMessages.find(m => m.id === selectedMessageId) || filteredMessages[0] || null;

  const handleSelectMessage = (msg: InboxMessage) => {
    setSelectedMessageId(msg.id);
    setIsReplying(false);
    if (!msg.read) {
      markMessageAsRead(msg.id);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshMailbox();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyContent.trim()) return;

    setIsSendingReply(true);
    try {
      const success = await sendReplyMessage(
        activeMessage.id,
        replyContent.trim(),
        `Re: ${activeMessage.subject}`
      );
      if (success) {
        setReplyContent('');
        setIsReplying(false);
      }
    } finally {
      setIsSendingReply(false);
    }
  };

  const handlePostInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTitle.trim() || !composeSubject.trim() || !composeBody.trim()) return;

    setIsPostingInquiry(true);
    try {
      const success = await postInquiryMessage(
        composeTitle.trim(),
        composeSubject.trim(),
        composeBody.trim()
      );
      if (success) {
        setComposeTitle('');
        setComposeSubject('');
        setComposeBody('');
        setIsComposing(false);
      }
    } finally {
      setIsPostingInquiry(false);
    }
  };

  const handleApproveApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantEmail.trim() || !sessionToken) return;

    setIsSubmittingApproval(true);
    setApprovalFeedback(null);
    try {
      const res = await supabaseService.approveTesterRequest(sessionToken, {
        targetEmail: applicantEmail.trim(),
        approvedRole: approvalRole,
        customNote: approvalNotes.trim() || undefined,
      });

      setApprovalFeedback(res.message);
      setApplicantEmail('');
      setApprovalNotes('');
      await refreshMailbox();
    } catch (err: any) {
      setApprovalFeedback(`Error: ${err.message || 'Approval failed'}`);
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#141413]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="inbox-title"
          className="w-screen max-w-3xl bg-[#FAF8F5] text-[#141413] shadow-2xl flex flex-col border-l-2 border-[#141413] relative animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E3E0D8] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#141413] text-white">
                <Inbox size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="inbox-title" className="text-xl font-serif text-[#141413] font-bold">
                    Institutional Mailbox
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#E5182B] text-white text-[11px] font-mono font-semibold rounded-full">
                      {unreadCount} NEW
                    </span>
                  )}
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    SUPABASE EDGE CLOUD
                  </span>
                </div>
                <p className="text-xs font-mono text-[#87857F] mt-0.5">
                  SECURE CLEARANCE & DIALECTIC DISPATCHES
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleManualRefresh}
                className="p-2 text-[#87857F] hover:text-[#141413] hover:bg-[#F0EEE6] rounded transition-colors cursor-pointer"
                title="Refresh messages from Supabase"
              >
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              {/* Compose New Message Button */}
              <button
                onClick={() => {
                  setIsComposing(prev => !prev);
                  setShowApprovalTool(false);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isComposing 
                    ? 'bg-[#141413] text-white' 
                    : 'bg-[#F0EEE6] hover:bg-[#E3E0D8] text-[#141413]'
                }`}
                title="Compose inquiry or test report"
              >
                <PlusCircle size={13} />
                <span>{isComposing ? 'Close Composer' : 'Compose'}</span>
              </button>

              {/* Approve Request Tool Button (For beta tester admins) */}
              <button
                onClick={() => {
                  setShowApprovalTool(prev => !prev);
                  setIsComposing(false);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showApprovalTool 
                    ? 'bg-[#E5182B] text-white' 
                    : 'bg-[#F0EEE6] hover:bg-[#E3E0D8] text-[#141413]'
                }`}
                title="Approve applicant beta requests"
              >
                <UserCheck size={13} />
                <span>Approvals</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllMessagesAsRead}
                  className="px-2.5 py-1 text-xs font-mono text-[#66645E] hover:text-[#141413] hover:bg-[#F0EEE6] rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-[#87857F] hover:text-[#141413] hover:bg-[#F0EEE6] rounded transition-colors cursor-pointer"
                title="Close mailbox"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conditional Banner: Compose New Inquiry */}
          {isComposing && (
            <div className="p-5 bg-white border-b border-[#141413] shadow-md animate-in slide-in-from-top-3 duration-200">
              <form onSubmit={handlePostInquiry} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3E0D8]">
                  <span className="text-xs font-mono text-[#E5182B] font-semibold flex items-center gap-1.5">
                    <Mail size={13} />
                    COMPOSE TO INSTITUTIONAL ACCESS COMMITTEE
                  </span>
                  <span className="text-[10px] font-mono text-[#87857F]">SUBMIT VIA EDGE FUNCTION</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Message Title (e.g. Model Parameter Inquiry)"
                    value={composeTitle}
                    onChange={(e) => setComposeTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Subject Header"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Detail your request, test scenario observation, or expanded role clearance requirement..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413] font-sans"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-1.5 text-xs font-mono text-[#87857F] hover:text-[#141413]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPostingInquiry}
                    className="px-5 py-1.5 bg-[#141413] hover:bg-[#2B2A28] text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send size={12} />
                    <span>{isPostingInquiry ? 'Dispatching...' : 'Dispatch Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Conditional Banner: Applicant Request Approval Tool */}
          {showApprovalTool && (
            <div className="p-5 bg-white border-b border-[#E5182B] shadow-md animate-in slide-in-from-top-3 duration-200">
              <form onSubmit={handleApproveApplicant} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3E0D8]">
                  <span className="text-xs font-mono text-[#E5182B] font-semibold flex items-center gap-1.5">
                    <UserCheck size={14} />
                    APPROVE BETA TESTER APPLICANT REQUEST
                  </span>
                  <span className="text-[10px] font-mono text-[#87857F]">PRIVILEGED COMMITTEE ACTION</span>
                </div>

                {approvalFeedback && (
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono text-[#141413] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>{approvalFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#87857F] mb-1">
                      Applicant Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. applicant@hedgefund.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#87857F] mb-1">
                      Target Role Assignment
                    </label>
                    <select
                      value={approvalRole}
                      onChange={(e) => setApprovalRole(e.target.value as BetaRole)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                    >
                      {BETA_ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.title} ({r.badge})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Optional Committee Reviewer Notes"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApprovalTool(false)}
                    className="px-4 py-1.5 text-xs font-mono text-[#87857F] hover:text-[#141413]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApproval}
                    className="px-5 py-1.5 bg-[#E5182B] hover:bg-[#FF2A3D] text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck size={13} />
                    <span>{isSubmittingApproval ? 'Verifying & Approving...' : 'Grant Clearance & Approve'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Bar */}
          <div className="px-6 py-2.5 bg-[#F7F5F0] border-b border-[#E3E0D8] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#87857F] mr-2">FILTER:</span>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#141413] text-white font-semibold'
                    : 'text-[#66645E] hover:text-[#141413]'
                }`}
              >
                ALL ({inboxMessages.length})
              </button>
              <button
                onClick={() => setActiveFilter('approval')}
                className={`px-2.5 py-1 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'approval'
                    ? 'bg-[#E5182B] text-white font-semibold'
                    : 'text-[#66645E] hover:text-[#141413]'
                }`}
              >
                <ShieldCheck size={12} />
                <span>APPROVALS ({inboxMessages.filter(m => m.category === 'approval').length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('system')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  activeFilter === 'system'
                    ? 'bg-[#141413] text-white font-semibold'
                    : 'text-[#66645E] hover:text-[#141413]'
                }`}
              >
                TELEMETRY ({inboxMessages.filter(m => m.category === 'system').length})
              </button>
            </div>

            <div className="text-[11px] text-[#87857F] hidden sm:block">
              POSTGRES RLS VERIFIED
            </div>
          </div>

          {/* Split Content: Message List & Detail Viewer */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#E3E0D8]">
            {/* Left list column */}
            <div className="md:w-5/12 overflow-y-auto max-h-[35vh] md:max-h-none divide-y divide-[#E3E0D8] bg-white">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#87857F] space-y-2">
                  <Mail size={24} className="mx-auto text-[#C5C2BA]" />
                  <p>No messages in this filter</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = activeMessage?.id === msg.id;
                  const isApproval = msg.category === 'approval';

                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full p-4 text-left transition-colors cursor-pointer relative block ${
                        isSelected 
                          ? 'bg-[#F0EEE6]' 
                          : 'hover:bg-[#FAF8F5]'
                      } ${!msg.read ? 'font-semibold' : ''}`}
                    >
                      {!msg.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#E5182B]" />
                      )}

                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#87857F]">
                          {isApproval ? (
                            <span className="text-[#E5182B] font-semibold flex items-center gap-1">
                              <ShieldCheck size={11} />
                              APPROVAL
                            </span>
                          ) : (
                            <span className="text-[#141413] font-semibold">SYSTEM</span>
                          )}
                          <span>·</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div className="text-xs sm:text-sm font-serif text-[#141413] truncate">
                          {msg.title}
                        </div>

                        <div className="text-[11px] text-[#66645E] line-clamp-2 font-sans font-normal">
                          {msg.subject}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right detail view column */}
            <div className="md:w-7/12 flex-1 overflow-y-auto p-5 sm:p-6 bg-[#FAF8F5] flex flex-col justify-between space-y-6">
              {activeMessage ? (
                <div className="space-y-5">
                  {/* Message Category and Sender info */}
                  <div className="pb-4 border-b border-[#E3E0D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase ${
                        activeMessage.category === 'approval'
                          ? 'bg-[#E5182B]/10 text-[#E5182B] border border-[#E5182B]/30'
                          : 'bg-[#141413]/10 text-[#141413] border border-[#141413]/20'
                      }`}>
                        {activeMessage.category === 'approval' ? 'OFFICIAL APPROVAL' : 'SYSTEM DISPATCH'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsReplying(prev => !prev)}
                          className="px-2.5 py-1 bg-white hover:bg-[#F0EEE6] border border-[#E3E0D8] text-xs font-mono text-[#141413] rounded flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reply to message"
                        >
                          <Reply size={13} />
                          <span>{isReplying ? 'Close Reply' : 'Reply'}</span>
                        </button>
                        <button
                          onClick={() => deleteMessage(activeMessage.id)}
                          className="text-[#87857F] hover:text-[#E5182B] p-1 transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-serif text-[#141413] leading-snug">
                      {activeMessage.title}
                    </h4>

                    <div className="font-mono text-xs text-[#66645E] space-y-0.5">
                      <div><span className="text-[#87857F]">FROM:</span> {activeMessage.sender}</div>
                      <div><span className="text-[#87857F]">SUBJECT:</span> {activeMessage.subject}</div>
                      <div><span className="text-[#87857F]">DISPATCHED:</span> {activeMessage.timestamp}</div>
                    </div>
                  </div>

                  {/* Body text */}
                  <div className="text-sm font-sans text-[#292825] leading-relaxed whitespace-pre-line bg-white p-4 sm:p-5 border border-[#E3E0D8]">
                    {activeMessage.body}
                  </div>

                  {/* Reply Form */}
                  {isReplying && (
                    <div className="p-4 bg-white border-2 border-[#141413] space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                          <Reply size={13} />
                          POST REPLY TO ACCESS COMMITTEE
                        </span>
                        <span className="text-[#87857F]">EDGE FUNCTION ROUTED</span>
                      </div>

                      <textarea
                        required
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply regarding "${activeMessage.subject}"...`}
                        className="w-full p-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs focus:outline-none focus:border-[#141413]"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsReplying(false)}
                          className="px-3 py-1.5 text-xs font-mono text-[#87857F] hover:text-[#141413]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSendReply}
                          disabled={isSendingReply || !replyContent.trim()}
                          className="px-4 py-1.5 bg-[#141413] hover:bg-[#2B2A28] disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Send size={12} />
                          <span>{isSendingReply ? 'Sending to Supabase...' : 'Send Reply'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role Specific Approval Callout Card */}
                  {activeMessage.roleGranted && (
                    <div className="p-4 bg-[#141413] text-[#FAF8F5] space-y-3 font-mono text-xs border border-[#2B2A28]">
                      <div className="flex items-center justify-between border-b border-[#33322E] pb-2">
                        <span className="text-[#E5182B] font-semibold flex items-center gap-1.5">
                          <ShieldCheck size={14} />
                          PROVISIONED ROLE BADGE
                        </span>
                        <span className="text-[#A19F97]">{activeMessage.clearanceCode}</span>
                      </div>

                      <div className="text-sm font-sans font-semibold text-white">
                        {getBetaRoleInfo(activeMessage.roleGranted).title}
                      </div>

                      <div className="text-[11px] text-[#A19F97] leading-relaxed">
                        Clearance Tier: {getBetaRoleInfo(activeMessage.roleGranted).clearanceLevel}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onClose();
                            launchLiveBeta(onNavigate);
                          }}
                          className="w-full py-2.5 px-4 bg-[#E5182B] hover:bg-[#FF2A3D] text-white text-xs font-sans font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Activity size={14} />
                          <span>Preview Beta Version with this Role</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action button if present and not roleGranted card */}
                  {activeMessage.actionLabel && activeMessage.actionPage && !activeMessage.roleGranted && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          if (activeMessage.actionLabel === 'Preview Beta Version') {
                            launchLiveBeta(onNavigate);
                          } else {
                            onNavigate(activeMessage.actionPage!);
                          }
                        }}
                        className="py-2.5 px-5 bg-[#141413] hover:bg-[#2B2A28] text-white text-xs font-semibold rounded-full transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{activeMessage.actionLabel}</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-xs font-mono text-[#87857F]">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F0EEE6] border-t border-[#E3E0D8] flex items-center justify-between text-[11px] font-mono text-[#87857F]">
            <span>ENDPOINT: /functions/v1/auth-middleware</span>
            <span>AAKASHAVANI SECURED VIA SUPABASE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
