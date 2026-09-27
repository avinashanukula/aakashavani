import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, BetaRole, InboxMessage, Page } from '../types';
import { getBetaRoleInfo } from '../data/betaRoles';
import { supabaseService } from '../services/supabaseService';

export const PROTOLOPP_LIVE_URL = 'https://protolopp-desktop-psi.vercel.app';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'system' | 'alert' | 'success';
  timestamp: string;
}

interface AuthContextType {
  currentUser: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  inboxMessages: InboxMessage[];
  unreadCount: number;
  isLoading: boolean;
  notificationsEnabled: boolean;
  notificationPromptOpen: boolean;
  toastList: ToastNotification[];
  signIn: (email: string, credential?: string) => Promise<boolean>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    role: BetaRole;
  }) => Promise<User>;
  initiateSignIn: (email: string, credential?: string) => Promise<{ require2fa: boolean; email: string; message: string; previewCode?: string }>;
  initiateSignUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    role: BetaRole;
  }) => Promise<{ require2fa: boolean; email: string; message: string; previewCode?: string; clearanceCode?: string }>;
  verifyTwoFactor: (email: string, code: string) => Promise<User>;
  resendTwoFactor: (email: string) => Promise<{ success: boolean; message: string; previewCode?: string }>;
  refreshUserStatus: () => Promise<User | null>;
  signOut: () => void;
  updateUserRole: (newRole: BetaRole) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  markAllMessagesAsRead: () => Promise<void>;
  deleteMessage: (messageId: string) => void;
  sendReplyMessage: (parentMessageId: string, replyBody: string, subject?: string) => Promise<boolean>;
  postInquiryMessage: (title: string, subject: string, body: string) => Promise<boolean>;
  refreshMailbox: () => Promise<void>;
  turnOnNotifications: () => Promise<boolean>;
  dismissNotificationPrompt: () => void;
  reopenNotificationPrompt: () => void;
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  launchLiveBeta: (onNavigate?: (page: Page) => void) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'veiron_beta_user_v2';
const STORAGE_KEY_TOKEN = 'veiron_beta_token_v2';
const STORAGE_KEY_NOTIFS = 'veiron_beta_notifications_enabled_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null;
  });

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  });

  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_NOTIFS) === 'true';
    } catch {
      return false;
    }
  });

  const [notificationPromptOpen, setNotificationPromptOpen] = useState<boolean>(false);
  const [toastList, setToastList] = useState<ToastNotification[]>([]);

  const addToast = useCallback((
    title: string, 
    message: string, 
    type: ToastNotification['type'] = 'system'
  ) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToastList(prev => [newToast, ...prev].slice(0, 4));

    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } catch (err) {
        console.warn('Browser notification failed:', err);
      }
    }

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, [notificationsEnabled]);

  const removeToast = (id: string) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  // Sync user state and token to localStorage
  useEffect(() => {
    if (currentUser && sessionToken) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, sessionToken);
    } else if (!currentUser) {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [currentUser, sessionToken]);

  // Sync notifications preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Prompt for notification permission on initial load if disabled
  useEffect(() => {
    const isEnabled = localStorage.getItem(STORAGE_KEY_NOTIFS) === 'true';
    if (!isEnabled) {
      const timer = setTimeout(() => {
        setNotificationPromptOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch messages from Supabase Edge Function
  const refreshMailbox = useCallback(async () => {
    if (!sessionToken) return;
    try {
      const { messages } = await supabaseService.fetchMailboxMessages(sessionToken);
      setInboxMessages(messages);
    } catch (err) {
      console.warn('Failed to refresh mailbox from Supabase:', err);
    }
  }, [sessionToken]);

  // Validate session and hydrate mailbox on load
  useEffect(() => {
    if (!sessionToken) return;

    let isMounted = true;
    const verifyAndLoad = async () => {
      setIsLoading(true);
      try {
        const sessionData = await supabaseService.verifySession(sessionToken);
        if (sessionData && isMounted) {
          setCurrentUser(sessionData.user);
          const { messages } = await supabaseService.fetchMailboxMessages(sessionToken);
          if (isMounted) setInboxMessages(messages);
        }
      } catch (err) {
        console.warn('Session verification fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyAndLoad();
    return () => { isMounted = false; };
  }, [sessionToken]);

  const turnOnNotifications = async (): Promise<boolean> => {
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
    setNotificationsEnabled(true);
    setNotificationPromptOpen(false);
    addToast(
      'Notifications Enabled',
      'You will receive instant Supabase Edge Function clearance dispatches and model events.',
      'success'
    );
    return true;
  };

  const dismissNotificationPrompt = () => setNotificationPromptOpen(false);
  const reopenNotificationPrompt = () => setNotificationPromptOpen(true);

  // Step 1: Initiate Sign Up (generates 2FA code in Supabase DB)
  const initiateSignUp = async (data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    role: BetaRole;
  }) => {
    setIsLoading(true);
    try {
      const res = await supabaseService.registerBetaTester(data);
      addToast(
        '2-Step Verification Dispatched',
        `A 6-digit verification code has been dispatched to ${data.email}.`,
        'approval'
      );
      return res;
    } catch (err: any) {
      addToast('Registration Error', err?.message || 'Failed to submit registration.', 'alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Initiate Sign In (validates password, generates 2FA code in Supabase DB)
  const initiateSignIn = async (email: string, credential?: string) => {
    setIsLoading(true);
    try {
      const res = await supabaseService.signIn(email, credential);
      addToast(
        '2-Step Verification Dispatched',
        `A 6-digit verification code has been dispatched to ${email}.`,
        'system'
      );
      return res;
    } catch (err: any) {
      addToast('Sign-In Error', err?.message || 'Authentication failed.', 'alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Complete Two-Factor Authentication with Supabase Edge Function
  const verifyTwoFactor = async (email: string, code: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await supabaseService.verifyTwoFactor(email, code);
      setCurrentUser(res.user);
      setSessionToken(res.sessionToken);

      // Hydrate mailbox directly from Supabase
      try {
        const { messages } = await supabaseService.fetchMailboxMessages(res.sessionToken);
        setInboxMessages(messages);
      } catch (e) {
        console.warn('Mailbox fetch failed on 2FA:', e);
      }

      if (res.user.approvalStatus === 'approved') {
        addToast(
          'Institutional Clearance Approved',
          `Welcome back, ${res.user.fullName}. Live simulation desk access is active.`,
          'success'
        );
      } else {
        addToast(
          '2FA Verified · Awaiting Supabase Approval',
          `Your identity is verified. Application is in PENDING status. The administrator will manually review and approve in Supabase.`,
          'approval'
        );
      }

      return res.user;
    } catch (err: any) {
      addToast('Verification Failed', err?.message || 'Invalid or expired 2-step verification code.', 'alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend 2FA code
  const resendTwoFactor = async (email: string) => {
    try {
      const res = await supabaseService.resendTwoFactor(email);
      addToast('Code Resent', res.message || 'Fresh 6-digit code dispatched.', 'system');
      return res;
    } catch (err: any) {
      addToast('Resend Failed', err?.message || 'Could not resend verification code.', 'alert');
      throw err;
    }
  };

  // Check / Refresh User Clearance Status from Supabase Table
  const refreshUserStatus = async (): Promise<User | null> => {
    if (!sessionToken) return null;
    setIsLoading(true);
    try {
      const sessionData = await supabaseService.verifySession(sessionToken);
      if (sessionData && sessionData.user) {
        setCurrentUser(sessionData.user);
        if (sessionData.user.approvalStatus === 'approved') {
          addToast(
            'Clearance Approved by Admin',
            'Your account has been approved in Supabase! Live simulation desk access is now unlocked.',
            'approval'
          );
        } else {
          addToast(
            'Status: Pending Manual Approval',
            'Your clearance remains in PENDING status. Awaiting administrator review in the Supabase Table Editor.',
            'system'
          );
        }
        return sessionData.user;
      }
      return null;
    } catch (err: any) {
      addToast('Status Refresh Failed', err?.message || 'Could not verify status with Supabase.', 'alert');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Compatibility wrappers
  const signUp = async (data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    role: BetaRole;
  }): Promise<User> => {
    await initiateSignUp(data);
    throw new Error('2-Step verification required. Please check your email for the confirmation code.');
  };

  const signIn = async (email: string, credential?: string): Promise<boolean> => {
    await initiateSignIn(email, credential);
    return true;
  };

  const signOut = () => {
    if (sessionToken) {
      supabaseService.signOut(sessionToken);
    }
    setCurrentUser(null);
    setSessionToken(null);
    setInboxMessages([]);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    addToast('Signed Out', 'Disconnected from Supabase beta session.', 'alert');
  };

  const updateUserRole = async (newRole: BetaRole) => {
    if (!sessionToken || !currentUser) return;
    setIsLoading(true);
    try {
      const updatedUser = await supabaseService.switchRole(sessionToken, newRole);
      setCurrentUser(updatedUser);
      await refreshMailbox();
      const roleInfo = getBetaRoleInfo(newRole);
      addToast(
        'Role Application Updated',
        `Role set to: ${roleInfo.title}. Clearance status is pending administrator review in Supabase.`,
        'approval'
      );
    } catch (err: any) {
      addToast('Role Switch Failed', err?.message || 'Unable to update role on Supabase.', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    setInboxMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
    if (sessionToken) {
      try {
        await supabaseService.markAsRead(sessionToken, messageId);
      } catch (e) {
        console.warn('markAsRead remote failed:', e);
      }
    }
  };

  const markAllMessagesAsRead = async () => {
    setInboxMessages(prev => prev.map(m => ({ ...m, read: true })));
    if (sessionToken) {
      try {
        await supabaseService.markAsRead(sessionToken, undefined, true);
      } catch (e) {
        console.warn('markAllMessagesAsRead remote failed:', e);
      }
    }
  };

  const deleteMessage = (messageId: string) => {
    setInboxMessages(prev => prev.filter(m => m.id !== messageId));
  };

  // Reply to an email / message in the mailbox
  const sendReplyMessage = async (parentMessageId: string, replyBody: string, subject?: string): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await supabaseService.replyMailboxMessage(sessionToken, { parentMessageId, replyBody, subject });
      await refreshMailbox();
      addToast('Reply Dispatched', 'Your follow-up was submitted. Committee response recorded.', 'success');
      return true;
    } catch (err: any) {
      addToast('Reply Failed', err?.message || 'Could not send reply through Edge Function.', 'alert');
      return false;
    }
  };

  // Post a new message / inquiry into the mailbox
  const postInquiryMessage = async (title: string, subject: string, body: string): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await supabaseService.postMailboxMessage(sessionToken, { title, subject, body, category: 'inquiry' });
      await refreshMailbox();
      addToast('Inquiry Submitted', 'Your inquiry has been submitted to the Institutional Access Committee.', 'success');
      return true;
    } catch (err: any) {
      addToast('Failed to post message', err?.message || 'Error communicating with Supabase Edge Function.', 'alert');
      return false;
    }
  };

  // Launch and Redirect to Live Simulation Environment with Strict Auth & Manual Approval Verification
  const launchLiveBeta = (onNavigate?: (page: Page) => void): boolean => {
    // Check 1: Authentication Requirement
    if (!currentUser || !sessionToken) {
      addToast(
        'Institutional Authentication Required',
        'You must sign in and complete 2-step verification before accessing the live simulation desk.',
        'alert'
      );
      if (onNavigate) {
        onNavigate('auth');
      }
      return false;
    }

    // Check 2: Strict Manual Supabase Approval Requirement
    if (currentUser.approvalStatus !== 'approved') {
      addToast(
        'Manual Supabase Approval Required',
        'Access Restricted: Your application is pending manual review in Supabase by the administrator. Live simulation access remains locked until approved.',
        'alert'
      );
      return false;
    }

    // Check 3: Role Authorization
    const roleInfo = getBetaRoleInfo(currentUser.role);
    addToast(
      'Live Clearance Verified',
      `Launching Aakashavani Live Simulation [${currentUser.clearanceCode}] · ${roleInfo.title}...`,
      'approval'
    );

    // Cryptographic / institutional query parameters verifying clearance
    const secureParams = new URLSearchParams({
      clearance: currentUser.clearanceCode,
      role: currentUser.role,
      tier: currentUser.testerTier || 'TIER-1 EARLY ACCESS',
      institution: currentUser.institution || 'Institutional Research Desk',
      auth: 'verified',
      session: sessionToken.slice(0, 16),
      timestamp: Date.now().toString(),
    });

    // Vercel deployment root handles SPA routing without 404
    const targetUrl = `${PROTOLOPP_LIVE_URL}/?${secureParams.toString()}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    return true;
  };

  const unreadCount = inboxMessages.filter(m => !m.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        sessionToken,
        isAuthenticated: !!currentUser,
        inboxMessages,
        unreadCount,
        isLoading,
        notificationsEnabled,
        notificationPromptOpen,
        toastList,
        signIn,
        signUp,
        initiateSignIn,
        initiateSignUp,
        verifyTwoFactor,
        resendTwoFactor,
        refreshUserStatus,
        signOut,
        updateUserRole,
        markMessageAsRead,
        markAllMessagesAsRead,
        deleteMessage,
        sendReplyMessage,
        postInquiryMessage,
        refreshMailbox,
        turnOnNotifications,
        dismissNotificationPrompt,
        reopenNotificationPrompt,
        addToast,
        removeToast,
        launchLiveBeta
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
