import { User, BetaRole, InboxMessage, BetaReview, AdminUserRecord } from '../types';

const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://slfllzppphyhkpsjmupp.supabase.co';

const EDGE_MIDDLEWARE_ENDPOINT = `${SUPABASE_URL}/functions/v1/auth-middleware`;

/**
 * Hardened Supabase Gateway Service (Zero Client Keys Exposed)
 * Defense-in-depth:
 * - All operations route strictly through the deployed auth-middleware Edge Function.
 * - Zero direct database connection strings, anon keys, or service role keys are exposed.
 * - Session tokens carry 7-day server expiration and are invalidated upon sign-out.
 */
class SupabaseService {
  private async invokeMiddleware<T>(action: string, payload: Record<string, unknown> = {}, sessionToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sessionToken) {
      headers['x-session-token'] = sessionToken;
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    try {
      const response = await fetch(EDGE_MIDDLEWARE_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Middleware error: HTTP ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      console.error(`Supabase Edge Function [${action}] error:`, err);
      throw err;
    }
  }

  /**
   * Register a new Beta Tester through the Edge Function middleware.
   * Hardened against account takeover.
   */
  /**
   * Register a new Beta Tester through the Edge Function middleware.
   * Enforces 2-step verification and sets approval status to 'pending' (manual Supabase approval).
   */
  async registerBetaTester(data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    role: BetaRole;
    password?: string;
  }): Promise<{ require2fa: boolean; email: string; message: string; previewCode?: string; clearanceCode?: string }> {
    return await this.invokeMiddleware<{
      require2fa: boolean;
      email: string;
      message: string;
      previewCode?: string;
      clearanceCode?: string;
    }>('register', data);
  }

  /**
   * Authenticate an existing institutional tester account.
   * Step 1: Validates credentials and dispatches 6-digit 2-step verification code.
   */
  async signIn(email: string, credential?: string): Promise<{ require2fa: boolean; email: string; message: string; previewCode?: string }> {
    return await this.invokeMiddleware<{
      require2fa: boolean;
      email: string;
      message: string;
      previewCode?: string;
    }>('signin', { email, credential });
  }

  /**
   * Step 2: Verify the 6-digit two-factor verification code and retrieve authenticated session token.
   */
  async verifyTwoFactor(email: string, code: string): Promise<{ user: User; sessionToken: string }> {
    const res = await this.invokeMiddleware<{
      success: boolean;
      user: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        institution: string;
        role: BetaRole;
        approval_status: 'approved' | 'pending';
        clearance_code: string;
        notifications_enabled: boolean;
        tester_tier: string;
        created_at: string;
      };
      sessionToken: string;
    }>('verify-2fa', { email, code });

    const mappedUser: User = {
      id: res.user.id,
      fullName: res.user.full_name,
      email: res.user.email,
      phone: res.user.phone,
      institution: res.user.institution,
      role: res.user.role,
      approvalStatus: res.user.approval_status,
      joinedAt: new Date(res.user.created_at).toLocaleDateString(),
      clearanceCode: res.user.clearance_code,
      notificationsEnabled: res.user.notifications_enabled,
      testerTier: res.user.tester_tier,
    };

    return { user: mappedUser, sessionToken: res.sessionToken };
  }

  /**
   * Resend a fresh 6-digit two-step verification code.
   */
  async resendTwoFactor(email: string): Promise<{ success: boolean; message: string; previewCode?: string }> {
    return await this.invokeMiddleware<{ success: boolean; message: string; previewCode?: string }>('resend-2fa', { email });
  }

  /**
   * Request institutional clearance code retrieval (Rate limited to max 2 requests per hour).
   */
  async requestClearanceCode(email: string): Promise<{ success: boolean; message: string }> {
    return await this.invokeMiddleware<{ success: boolean; message: string }>('request-clearance', { email });
  }

  /**
   * Invalidate session token on server upon sign-out.
   */
  async signOut(sessionToken: string): Promise<void> {
    try {
      await this.invokeMiddleware('signout', {}, sessionToken);
    } catch (e) {
      console.warn('Server-side session termination failed:', e);
    }
  }

  /**
   * Verify an existing session token via Edge Function.
   */
  async verifySession(sessionToken: string): Promise<{ user: User; unreadCount: number } | null> {
    try {
      const res = await this.invokeMiddleware<{
        authenticated: boolean;
        user: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          institution: string;
          role: BetaRole;
          approval_status: 'approved' | 'pending';
          clearance_code: string;
          notifications_enabled: boolean;
          tester_tier: string;
          created_at: string;
        };
        unreadCount: number;
      }>('verify-session', {}, sessionToken);

      if (!res.authenticated || !res.user) return null;

      const mappedUser: User = {
        id: res.user.id,
        fullName: res.user.full_name,
        email: res.user.email,
        phone: res.user.phone,
        institution: res.user.institution,
        role: res.user.role,
        approvalStatus: res.user.approval_status,
        joinedAt: new Date(res.user.created_at).toLocaleDateString(),
        clearanceCode: res.user.clearance_code,
        notificationsEnabled: res.user.notifications_enabled,
        testerTier: res.user.tester_tier,
      };

      return { user: mappedUser, unreadCount: res.unreadCount };
    } catch {
      return null;
    }
  }

  /**
   * Retrieve all mailbox messages for the authenticated user from Supabase.
   */
  async fetchMailboxMessages(sessionToken: string): Promise<{ messages: InboxMessage[]; unreadCount: number }> {
    const res = await this.invokeMiddleware<{
      messages: Array<{
        id: string;
        sender: string;
        title: string;
        subject: string;
        body: string;
        category: 'approval' | 'system' | 'regime_alert' | 'reply' | 'inquiry';
        read: boolean;
        role_granted?: BetaRole;
        clearance_code?: string;
        parent_message_id?: string;
        created_at: string;
      }>;
      unreadCount: number;
    }>('list-messages', {}, sessionToken);

    const mappedMessages: InboxMessage[] = (res.messages || []).map((m) => ({
      id: m.id,
      sender: m.sender,
      title: m.title,
      subject: m.subject,
      body: m.body,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: m.read,
      category: m.category === 'reply' || m.category === 'inquiry' ? 'system' : m.category,
      roleGranted: m.role_granted,
      clearanceCode: m.clearance_code,
      actionLabel: m.category === 'approval' ? 'Preview Beta Version' : undefined,
      actionPage: m.category === 'approval' ? 'aakashavani' : undefined,
    }));

    return {
      messages: mappedMessages,
      unreadCount: res.unreadCount,
    };
  }

  /**
   * Mark a specific message or all messages as read.
   */
  async markAsRead(sessionToken: string, messageId?: string, markAll?: boolean): Promise<void> {
    await this.invokeMiddleware('mark-read', { messageId, markAll }, sessionToken);
  }

  /**
   * Post a new inquiry or beta feedback message to the committee mailbox.
   */
  async postMailboxMessage(
    sessionToken: string,
    message: { title: string; subject: string; body: string; category?: string }
  ): Promise<InboxMessage> {
    const res = await this.invokeMiddleware<{ message: any }>('post-message', message, sessionToken);
    return {
      id: res.message.id,
      sender: res.message.sender,
      title: res.message.title,
      subject: res.message.subject,
      body: res.message.body,
      timestamp: new Date(res.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: res.message.read,
      category: res.message.category,
    };
  }

  /**
   * Reply to an existing mailbox message thread and receive automated committee confirmation.
   * Protected with IDOR checks on server.
   */
  async replyMailboxMessage(
    sessionToken: string,
    reply: { parentMessageId: string; replyBody: string; subject?: string }
  ): Promise<{ userReply: any; message: string }> {
    return await this.invokeMiddleware<{ userReply: any; message: string }>('reply-message', reply, sessionToken);
  }

  /**
   * Switch the tester's beta role and issue new clearance credentials.
   */
  async switchRole(sessionToken: string, newRole: BetaRole): Promise<User> {
    const res = await this.invokeMiddleware<{
      user: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        institution: string;
        role: BetaRole;
        approval_status: 'approved' | 'pending';
        clearance_code: string;
        notifications_enabled: boolean;
        tester_tier: string;
        created_at: string;
      };
    }>('switch-role', { newRole }, sessionToken);

    return {
      id: res.user.id,
      fullName: res.user.full_name,
      email: res.user.email,
      phone: res.user.phone,
      institution: res.user.institution,
      role: res.user.role,
      approvalStatus: res.user.approval_status,
      joinedAt: new Date(res.user.created_at).toLocaleDateString(),
      clearanceCode: res.user.clearance_code,
      notificationsEnabled: res.user.notifications_enabled,
      testerTier: res.user.tester_tier,
    };
  }

  /**
   * Approve an applicant request (Authorized role operation).
   */
  async approveTesterRequest(
    sessionToken: string,
    approval: { targetEmail: string; approvedRole: string; customNote?: string }
  ): Promise<{ success: boolean; message: string }> {
    return await this.invokeMiddleware<{ success: boolean; message: string }>('approve-request', approval, sessionToken);
  }

  /**
   * Submit continuous feedback and reviews for Aakashavani beta testing.
   */
  async submitBetaReview(
    sessionToken: string,
    review: { rating: number; category: string; title: string; commentary: string; testedScenario?: string }
  ): Promise<{ success: boolean; message: string; review: BetaReview }> {
    return await this.invokeMiddleware<{ success: boolean; message: string; review: BetaReview }>('submit-review', review, sessionToken);
  }

  /**
   * Fetch beta reviews (optionally filtered by tester email).
   */
  async fetchBetaReviews(testerEmail?: string): Promise<BetaReview[]> {
    const res = await this.invokeMiddleware<{ success: boolean; reviews: BetaReview[] }>('list-reviews', { testerEmail });
    return res.reviews || [];
  }

  /**
   * Admin: List all registered beta testers and statuses.
   */
  async adminFetchUsers(adminKey: string): Promise<AdminUserRecord[]> {
    const res = await this.invokeMiddleware<{ success: boolean; users: AdminUserRecord[] }>('admin-list-users', { adminKey });
    return res.users || [];
  }

  /**
   * Admin: 1-click update user approval status ('approved' | 'pending' | 'rejected').
   */
  async adminUpdateUserStatus(
    adminKey: string,
    userId: string,
    newStatus: 'approved' | 'pending' | 'rejected'
  ): Promise<{ success: boolean; message: string; user: any }> {
    return await this.invokeMiddleware<{ success: boolean; message: string; user: any }>('admin-update-user-status', {
      adminKey,
      userId,
      newStatus
    });
  }

  /**
   * Admin: List all inquiries and mailbox dispatches.
   */
  async adminFetchMessages(adminKey: string): Promise<InboxMessage[]> {
    const res = await this.invokeMiddleware<{ success: boolean; messages: any[] }>('admin-list-messages', { adminKey });
    return (res.messages || []).map((m: any) => ({
      id: m.id,
      sender: m.sender || 'Institutional Desk',
      title: m.title || 'Inquiry',
      subject: m.subject || 'Message',
      body: m.body,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: m.read || false,
      category: m.category || 'inquiry',
      roleGranted: m.role_granted,
      clearanceCode: m.clearance_code
    }));
  }

  /**
   * Admin: Dispatch official administrative reply to a tester.
   */
  async adminReplyMessage(
    adminKey: string,
    reply: { userEmail: string; parentMessageId?: string; replyBody: string; subject?: string }
  ): Promise<{ success: boolean; message: string }> {
    return await this.invokeMiddleware<{ success: boolean; message: string }>('admin-reply-message', {
      adminKey,
      ...reply
    });
  }
}

export const supabaseService = new SupabaseService();
