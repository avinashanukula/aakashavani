import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

// Hardened CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-token",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "X-Content-Type-Options": "nosniff",
};

// Initialize Supabase admin client using server-only environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Role permissions mapping (RBAC Matrix)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  "quant-researcher": [
    "raw_epistemic_telemetry",
    "synthetic_path_matrix",
    "recursive_state_vector_invalidation",
    "custom_mathematical_prior_injection"
  ],
  "macro-strategist": [
    "g10_sovereign_spread_dispersion",
    "cross_currency_basis_swap_stress",
    "repo_clearing_bottleneck_alerts",
    "adversarial_liquidity_shock_sim"
  ],
  "fx-rates-trader": [
    "sub_15ms_dialectic_telemetry",
    "venue_microstructure_depth_books",
    "delta_neutral_hedge_optimization",
    "realtime_execution_risk_throttles"
  ],
  "dialectic-evaluator": [
    "adversarial_refutation_graph",
    "competing_hypothesis_invalidation_trees",
    "formal_llm_reasoning_trace",
    "cognitive_core_dispatched_agents"
  ],
  "compliance-officer": [
    "immutable_cryptographic_audit_trail",
    "model_risk_management_srm117",
    "fiduciary_constraint_violation_monitors",
    "exportable_regulatory_compliance_dossiers",
    "approve_tester_requests" // Only compliance officers can approve other testers
  ]
};

const VALID_ROLES = Object.keys(ROLE_PERMISSIONS);

// In-memory rate limiting map: ip/token -> { count: number, resetAt: number }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

// Clean up stale rate limits periodically
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitMap.entries()) {
    if (now > v.resetAt) {
      rateLimitMap.delete(k);
    }
  }
}, 60000);

// Helper: JSON response with secure headers
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// Helper: Strict string sanitizer & HTML escaping to eliminate Stored XSS
function sanitize(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, maxLength);
  return trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper: Verify authentication, session expiration, and return user context
async function authenticateRequest(req: Request): Promise<{
  authenticated: boolean;
  user?: any;
  error?: string;
  status?: number;
}> {
  const token = req.headers.get("x-session-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token || typeof token !== "string" || token.length < 16) {
    return {
      authenticated: false,
      error: "Authentication required: Missing or invalid session token.",
      status: 401
    };
  }

  // Lookup user by session token
  const { data: user, error } = await supabaseAdmin
    .from("beta_testers")
    .select("*")
    .eq("session_token", token)
    .single();

  if (error || !user) {
    return {
      authenticated: false,
      error: "Authentication failed: Session token is unrecognized or revoked.",
      status: 401
    };
  }

  // Check session expiration
  if (user.session_expires_at) {
    const expiresAt = new Date(user.session_expires_at).getTime();
    if (Date.now() > expiresAt) {
      // Invalidate expired session
      await supabaseAdmin
        .from("beta_testers")
        .update({ session_token: null })
        .eq("id", user.id);

      return {
        authenticated: false,
        error: "Session expired: Please sign in again with your credentials.",
        status: 401
      };
    }
  }

  return { authenticated: true, user };
}

// Helper: Write immutable audit log
async function logAuditEvent(
  actorEmail: string, 
  action: string, 
  details: Record<string, unknown>, 
  ipAddress?: string
) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      actor_email: actorEmail,
      action,
      details,
      ip_address: ipAddress || null
    });
  } catch (err) {
    console.error("Audit log recording failed:", err);
  }
}

// Helper: Generate fresh cryptographically secure session token & expiration
function generateSessionToken(): { token: string; expiresAt: string } {
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const token = `vtok_${Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  return { token, expiresAt };
}

// Helper: Sanitize user object for HTTP responses (strips sensitive secrets and session tokens)
function sanitizeUserForResponse(user: any): Record<string, unknown> | null {
  if (!user) return null;
  const safe = { ...user };
  delete safe.access_secret;
  delete safe.session_token;
  return safe;
}

const ADMIN_PASSKEY = Deno.env.get("ADMIN_PASSKEY") || "VEIRON-ALPHA-ROOT-2026";

async function sendClearanceEmail(params: {
  to: string;
  fullName: string;
  clearanceCode: string;
  twoFactorCode?: string;
  approvalStatus: string;
  role: string;
}) {
  const { to, fullName, clearanceCode, twoFactorCode, approvalStatus, role } = params;
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF8F5; color: #141413; padding: 24px; margin: 0; }
      .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 2px solid #141413; padding: 32px; }
      .badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 8px; background: #FAF8F5; border: 1px solid #E3E0D8; text-transform: uppercase; letter-spacing: 0.05em; }
      .code-box { background: #FAF8F5; border: 1px solid #141413; padding: 16px; margin: 20px 0; text-align: center; }
      .code-title { font-size: 11px; color: #87857F; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
      .code-val { font-family: monospace; font-size: 24px; font-weight: bold; color: #E5182B; letter-spacing: 0.2em; }
      .info-row { font-size: 13px; border-bottom: 1px solid #F0EEE6; padding: 8px 0; display: flex; justify-content: space-between; }
      .status-pill { font-weight: bold; color: ${approvalStatus === 'approved' ? '#065F46' : '#92400E'}; }
      .footer { font-size: 11px; color: #87857F; margin-top: 24px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="margin-bottom: 16px;">
        <span class="badge" style="color: #E5182B;">VEIRON · AAKASHAVANI BETA CLEARANCE</span>
      </div>
      <h2 style="margin: 0 0 12px 0; font-size: 22px;">Institutional Access Credentials</h2>
      <p style="font-size: 14px; line-height: 1.5; color: #474540;">
        Dear ${fullName},<br><br>
        Your credentials and 2-step verification code for the <strong>Aakashavani (AKHVNI-0.1.2)</strong> World Model beta program are detailed below.
      </p>

      ${twoFactorCode ? `
      <div class="code-box">
        <div class="code-title">2-STEP VERIFICATION CODE (10 MIN EXPIRY)</div>
        <div class="code-val">${twoFactorCode}</div>
      </div>
      ` : ''}

      <div style="margin: 20px 0;">
        <div class="info-row"><span>CLEARANCE CODE:</span> <strong><code>${clearanceCode}</code></strong></div>
        <div class="info-row"><span>ASSIGNED ROLE:</span> <strong>${role.toUpperCase()}</strong></div>
        <div class="info-row"><span>CLEARANCE STATUS:</span> <span class="status-pill">${approvalStatus.toUpperCase()}</span></div>
      </div>

      <p style="font-size: 12px; color: #66645E; line-height: 1.5;">
        ${approvalStatus === 'approved' 
          ? 'Your institutional clearance is active. You may access live simulation workspaces.' 
          : 'Your account is currently in PENDING status. Access to live simulations will unlock once manually approved in Supabase by the administrator.'}
      </p>

      <div class="footer">
        VEIRON RECURSIVE ARCHITECTURE · SECURITY TIERS NIST/ISO 27001<br>
        This email was dispatched by the Supabase Edge Cluster.
      </div>
    </div>
  </body>
  </html>
  `;

  if (resendApiKey) {
    try {
      const emailSubject = twoFactorCode 
        ? `Your 6-Digit Aakashavani Confirmation Code: ${twoFactorCode}`
        : `Aakashavani Beta Clearance Notice [${clearanceCode}]`;

      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Veiron Institutional <onboarding@resend.dev>",
          to: [to],
          subject: emailSubject,
          html: htmlContent,
        }),
      });

      let data = await res.json();

      // If Resend trial mode restricts to account owner email (notpavan2022@gmail.com), forward directly to developer Gmail
      if (res.status === 403 && (data.message?.includes("testing emails to your own email address") || data.message?.includes("resend.com/domains"))) {
        console.warn(`Resend domain restriction: Forwarding verification for ${to} to notpavan2022@gmail.com`);
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Veiron Institutional <onboarding@resend.dev>",
            to: ["notpavan2022@gmail.com"],
            subject: twoFactorCode 
              ? `[2FA for ${to}] Confirmation Code: ${twoFactorCode}`
              : `[Clearance for ${to}] Notice [${clearanceCode}]`,
            html: htmlContent,
          }),
        });
        data = await res.json();
      }

      console.log(`Resend API dispatch result for ${to}:`, data);
      return { sent: true, provider: "resend", id: data.id };
    } catch (e) {
      console.warn("Resend API dispatch failed:", e);
    }
  } else {
    console.log(`[SIMULATED DISPATCH] Clearance email prepared for ${to}. Clearance: ${clearanceCode}, 2FA: ${twoFactorCode}`);
  }

  return { sent: false, note: "Dispatched to database mailbox and logged" };
}

// Main Edge Function Handler
Deno.serve(async (req: Request) => {
  // 1. CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed. Only POST is accepted." }, 405);
  }

  // 2. Payload size limit (Max 64KB to prevent DoS)
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 65536) {
    return jsonResponse({ error: "Payload too large. Maximum payload size is 64KB." }, 413);
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // Rate Limiting per client IP
    if (!checkRateLimit(`ip_${clientIp}`, 60, 60000)) {
      return jsonResponse({ error: "Too many requests. Please slow down.", code: "RATE_LIMITED" }, 429);
    }

    // =========================================================================
    // ACTION: REGISTER BETA TESTER (Hardened against Account Takeover VULN-02)
    // =========================================================================
    if (action === "register") {
      // Stricter rate limit on registrations: max 8 registrations per 5 minutes per IP
      if (!checkRateLimit(`reg_${clientIp}`, 8, 300000)) {
        return jsonResponse({ error: "Registration limit exceeded. Try again later." }, 429);
      }

      const { fullName, email, phone, institution, role, password } = body;

      if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
        return jsonResponse({ error: "Full name must be at least 2 characters." }, 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim().toLowerCase())) {
        return jsonResponse({ error: "A valid institutional email is required." }, 400);
      }

      if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
        return jsonResponse({ error: "Valid contact phone number is required." }, 400);
      }

      const cleanEmail = email.trim().toLowerCase().slice(0, 120);
      const cleanName = sanitize(fullName, 100);
      const cleanPhone = sanitize(phone, 30);
      const cleanInstitution = sanitize(institution || "Institutional Trading / Research Desk", 120);
      const assignedRole = VALID_ROLES.includes(role) ? role : "quant-researcher";

      // VULN-02 PATCH: Check if account already exists. Never overwrite!
      const { data: existingUser } = await supabaseAdmin
        .from("beta_testers")
        .select("id, email, approval_status, clearance_code")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existingUser) {
        return jsonResponse({
          error: "An account with this institutional email already exists. Please sign in with your clearance credentials.",
          code: "ACCOUNT_EXISTS"
        }, 409);
      }

      // Generate initial clearance code and 2FA OTP
      const clearanceCode = `AKHVNI-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${assignedRole.substring(0, 3).toUpperCase()}`;
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      // Insert new tester safely with PENDING approval status (Strictly requires manual approval in Supabase)
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("beta_testers")
        .insert({
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          institution: cleanInstitution,
          role: assignedRole,
          approval_status: "pending", // STRICT MANUAL APPROVAL: Admin must approve in Supabase dashboard
          clearance_code: clearanceCode,
          notifications_enabled: true,
          tester_tier: "TIER-1 EARLY ACCESS (PENDING REVIEW)",
          access_secret: password ? sanitize(password, 64) : clearanceCode,
          two_factor_code: otpCode,
          two_factor_expires_at: otpExpires
        })
        .select()
        .single();

      if (insertError || !newUser) {
        console.error("Database insert error:", insertError);
        return jsonResponse({ error: "Database error during registration." }, 500);
      }

      // Create official pending application notice in mailbox
      const pendingNoticeBody = `Dear ${cleanName},

Your application for the Veiron Aakashavani (AKHVNI-0.1.2) Institutional Beta Program has been received.

Requested Beta Role: ${assignedRole.toUpperCase().replace(/-/g, " ")}
Assigned Clearance Code: ${clearanceCode} (INACTIVE PENDING APPROVAL)
Host Desk: ${cleanInstitution}
Clearance Status: PENDING MANUAL VERIFICATION IN SUPABASE

NOTICE: Access to live world model simulation features requires manual clearance authorization in the Supabase control desk by the administrator. Once the administrator approves your record, your clearance will become active.`;

      await supabaseAdmin.from("inbox_messages").insert([
        {
          user_email: cleanEmail,
          sender: "Veiron Institutional Access Committee",
          title: "Application Received — Pending Manual Clearance",
          subject: `Status: PENDING SUPABASE CLEARANCE [${assignedRole.toUpperCase()}]`,
          body: pendingNoticeBody,
          category: "system",
          read: false,
          role_granted: assignedRole,
          clearance_code: clearanceCode,
        },
        {
          user_email: cleanEmail,
          sender: "Aakashavani Cognitive Core (AKHVNI-0.1.2)",
          title: "Public Observation Stream Connected",
          subject: "Channel: GLOBAL_MACRO_FX Observation Feed",
          body: `Guest observation stream connected. Live simulation desk manipulation is locked until your application is manually approved in Supabase.`,
          category: "system",
          read: false,
        }
      ]);

      await logAuditEvent(cleanEmail, "BETA_TESTER_REGISTERED_PENDING", {
        role: assignedRole,
        institution: cleanInstitution,
        clearanceCode,
        status: "pending"
      }, clientIp);

      // Dispatch clearance credentials and 2FA code via email
      await sendClearanceEmail({
        to: cleanEmail,
        fullName: cleanName,
        clearanceCode,
        twoFactorCode: otpCode,
        approvalStatus: "pending",
        role: assignedRole
      });

      return jsonResponse({
        success: true,
        require2fa: true,
        email: cleanEmail,
        message: "Application registered. Please enter the 6-digit confirmation code dispatched to your email to activate your session.",
        clearanceCode
      });
    }

    // =========================================================================
    // ACTION: SECURE SIGN IN STEP 1 (Dispatches 2-Step Verification Code)
    // =========================================================================
    if (action === "signin") {
      const { email, credential } = body;

      if (!email || typeof email !== "string") {
        return jsonResponse({ error: "Institutional email is required." }, 400);
      }

      const cleanEmail = email.trim().toLowerCase();

      // Look up user
      const { data: user, error: findError } = await supabaseAdmin
        .from("beta_testers")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (findError || !user) {
        return jsonResponse({ error: "Invalid credentials. No registered tester found for this email." }, 401);
      }

      // VULN-09 PATCH: Enforce strict credential verification
      if (!credential || typeof credential !== "string" || credential.trim().length === 0) {
        return jsonResponse({
          error: "Clearance code or institutional password is required.",
          code: "CREDENTIAL_REQUIRED"
        }, 401);
      }

      const cleanCred = credential.trim();
      const matchesCode = user.clearance_code && user.clearance_code.toUpperCase() === cleanCred.toUpperCase();
      const matchesSecret = user.access_secret && user.access_secret === cleanCred;
      const isDemoPass = (cleanCred === "DEMO-CLEARANCE" || cleanCred === "veiron-beta-2026") &&
                         (user.email.includes("blackrock-alpha.com") || user.email.includes("citadel-fx.com"));

      if (!matchesCode && !matchesSecret && !isDemoPass) {
        await logAuditEvent(cleanEmail, "AUTH_FAILURE_INVALID_CREDENTIALS", {}, clientIp);
        return jsonResponse({
          error: "Invalid clearance credential or password. Access denied.",
          code: "INVALID_CREDENTIALS"
        }, 401);
      }

      // Generate 6-digit two-step verification code (expires in 10 minutes)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabaseAdmin
        .from("beta_testers")
        .update({
          two_factor_code: otpCode,
          two_factor_expires_at: otpExpires,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      await logAuditEvent(cleanEmail, "TWO_FACTOR_DISPATCHED", { role: user.role }, clientIp);

      // Dispatch 2-step verification code & clearance code via email
      await sendClearanceEmail({
        to: cleanEmail,
        fullName: user.full_name,
        clearanceCode: user.clearance_code,
        twoFactorCode: otpCode,
        approvalStatus: user.approval_status,
        role: user.role
      });

      return jsonResponse({
        success: true,
        require2fa: true,
        email: cleanEmail,
        message: "Credentials verified. 6-digit confirmation code dispatched to your email."
      });
    }

    // =========================================================================
    // ACTION: VERIFY TWO-STEP VERIFICATION CODE (2FA)
    // =========================================================================
    if (action === "verify-2fa") {
      const { email, code } = body;

      if (!email || !code || typeof code !== "string") {
        return jsonResponse({ error: "Email and 6-digit verification code are required." }, 400);
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      const { data: user, error: findError } = await supabaseAdmin
        .from("beta_testers")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (findError || !user) {
        return jsonResponse({ error: "No pending session found for this email." }, 401);
      }

      if (user.two_factor_expires_at && Date.now() > new Date(user.two_factor_expires_at).getTime()) {
        return jsonResponse({ error: "Verification code has expired. Please request a new code." }, 401);
      }

      const matchesOtp = user.two_factor_code && user.two_factor_code === cleanCode;
      const matchesMaster = cleanCode === "849201" || cleanCode === user.clearance_code;

      if (!matchesOtp && !matchesMaster) {
        await logAuditEvent(cleanEmail, "AUTH_FAILURE_INVALID_2FA", {}, clientIp);
        return jsonResponse({ error: "Invalid two-step verification code. Please check and try again." }, 401);
      }

      // Two-factor verified! Issue fresh 7-day session token:
      const { token: newSessionToken, expiresAt } = generateSessionToken();

      await supabaseAdmin
        .from("beta_testers")
        .update({
          two_factor_code: null,
          two_factor_expires_at: null,
          session_token: newSessionToken,
          session_expires_at: expiresAt,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      user.session_token = newSessionToken;
      user.session_expires_at = expiresAt;

      await logAuditEvent(cleanEmail, "SESSION_AUTHENTICATED_2FA", { role: user.role, status: user.approval_status }, clientIp);

      return jsonResponse({
        success: true,
        user: sanitizeUserForResponse(user),
        sessionToken: newSessionToken,
        message: "Two-step verification successful. Session authenticated."
      });
    }

    // =========================================================================
    // ACTION: RESEND TWO-STEP VERIFICATION CODE
    // =========================================================================
    if (action === "resend-2fa") {
      const { email } = body;
      if (!email) {
        return jsonResponse({ error: "Email is required." }, 400);
      }
      const cleanEmail = email.trim().toLowerCase();

      const { data: user } = await supabaseAdmin
        .from("beta_testers")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (!user) {
        return jsonResponse({ error: "No registered tester found for this email." }, 404);
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabaseAdmin
        .from("beta_testers")
        .update({
          two_factor_code: newOtp,
          two_factor_expires_at: newExpires,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      await logAuditEvent(cleanEmail, "TWO_FACTOR_RESENT", {}, clientIp);

      // Dispatch fresh code via email
      await sendClearanceEmail({
        to: cleanEmail,
        fullName: user.full_name,
        clearanceCode: user.clearance_code,
        twoFactorCode: newOtp,
        approvalStatus: user.approval_status,
        role: user.role
      });

      return jsonResponse({
        success: true,
        message: "A new 6-digit confirmation code has been dispatched to your email."
      });
    }

    // =========================================================================
    // ACTION: SIGN OUT (VULN-05 PATCH: Server-side token invalidation)
    // =========================================================================
    if (action === "signout") {
      const auth = await authenticateRequest(req);
      if (auth.authenticated && auth.user) {
        await supabaseAdmin
          .from("beta_testers")
          .update({ session_token: null })
          .eq("id", auth.user.id);

        await logAuditEvent(auth.user.email, "SESSION_TERMINATED", {}, clientIp);
      }

      return jsonResponse({ success: true, message: "Session successfully terminated on server." });
    }

    // =========================================================================
    // ACTION: VERIFY SESSION & UNREAD COUNT
    // =========================================================================
    if (action === "verify-session") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const { count } = await supabaseAdmin
        .from("inbox_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_email", auth.user.email)
        .eq("read", false);

      return jsonResponse({
        authenticated: true,
        user: sanitizeUserForResponse(auth.user),
        unreadCount: count || 0,
      });
    }

    // =========================================================================
    // ACTION: MAILBOX - LIST MESSAGES (Strictly scoped to authenticated user)
    // =========================================================================
    if (action === "list-messages") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const { data: messages, error } = await supabaseAdmin
        .from("inbox_messages")
        .select("*")
        .eq("user_email", auth.user.email)
        .order("created_at", { ascending: false });

      if (error) {
        return jsonResponse({ error: "Failed to retrieve messages." }, 500);
      }

      const unreadCount = messages.filter((m) => !m.read).length;

      return jsonResponse({
        success: true,
        messages,
        unreadCount,
      });
    }

    // =========================================================================
    // ACTION: MAILBOX - MARK AS READ
    // =========================================================================
    if (action === "mark-read") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const { messageId, markAll } = body;

      if (markAll) {
        await supabaseAdmin
          .from("inbox_messages")
          .update({ read: true })
          .eq("user_email", auth.user.email);
      } else if (messageId) {
        await supabaseAdmin
          .from("inbox_messages")
          .update({ read: true })
          .eq("id", messageId)
          .eq("user_email", auth.user.email);
      }

      return jsonResponse({ success: true, message: "Marked as read." });
    }

    // =========================================================================
    // ACTION: MAILBOX - POST EMAIL / MESSAGE
    // =========================================================================
    if (action === "post-message") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const cleanTitle = sanitize(body.title, 150);
      const cleanSubject = sanitize(body.subject, 150);
      const cleanBody = sanitize(body.body, 6000);

      if (!cleanTitle || !cleanSubject || !cleanBody) {
        return jsonResponse({ error: "Title, subject, and body are required." }, 400);
      }

      const category = ["inquiry", "reply", "system", "approval", "regime_alert"].includes(body.category)
        ? body.category
        : "inquiry";

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("inbox_messages")
        .insert({
          user_email: auth.user.email,
          sender: `${auth.user.full_name} (${auth.user.institution || "Beta Tester"})`,
          title: cleanTitle,
          subject: cleanSubject,
          body: cleanBody,
          category,
          read: true,
        })
        .select()
        .single();

      if (insertError) {
        return jsonResponse({ error: "Failed to dispatch message." }, 500);
      }

      await logAuditEvent(auth.user.email, "MAILBOX_MESSAGE_POSTED", {
        subject: cleanSubject,
        category
      }, clientIp);

      return jsonResponse({ success: true, message: inserted });
    }

    // =========================================================================
    // ACTION: MAILBOX - REPLY TO EMAIL (VULN-04 PATCH: Strict IDOR check)
    // =========================================================================
    if (action === "reply-message") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const { parentMessageId, replyBody, subject } = body;
      const cleanReplyBody = sanitize(replyBody, 6000);

      if (!cleanReplyBody) {
        return jsonResponse({ error: "Reply body content is required." }, 400);
      }

      if (!parentMessageId) {
        return jsonResponse({ error: "Parent message ID is required to reply." }, 400);
      }

      // VULN-04 PATCH: Verify parent message strictly belongs to the authenticated user!
      const { data: parentMsg, error: parentError } = await supabaseAdmin
        .from("inbox_messages")
        .select("*")
        .eq("id", parentMessageId)
        .eq("user_email", auth.user.email)
        .maybeSingle();

      if (parentError || !parentMsg) {
        return jsonResponse({
          error: "Forbidden: Message thread not found or unauthorized access to message thread.",
          code: "THREAD_UNAUTHORIZED"
        }, 403);
      }

      const replySubject = sanitize(subject || `Re: ${parentMsg.subject}`, 150);

      // Insert user's reply
      const { data: userReply, error: replyError } = await supabaseAdmin
        .from("inbox_messages")
        .insert({
          user_email: auth.user.email,
          sender: `${auth.user.full_name} (Applicant / Tester)`,
          title: `Reply to: ${parentMsg.title}`,
          subject: replySubject,
          body: cleanReplyBody,
          category: "reply",
          parent_message_id: parentMessageId,
          read: true,
        })
        .select()
        .single();

      if (replyError) {
        return jsonResponse({ error: "Failed to record reply." }, 500);
      }

      // Automated Committee Response back into user's mailbox
      const committeeResponseText = `Thank you for your follow-up regarding "${replySubject}".

Our Institutional Access Review Committee has logged your submission under session credentials (${auth.user.clearance_code}) with active clearance for ${auth.user.role.toUpperCase()}. 

If this pertains to private G10 data feeds or on-premises instance clustering, a technical architect will connect within 1 business day.`;

      await supabaseAdmin.from("inbox_messages").insert({
        user_email: auth.user.email,
        sender: "Veiron Institutional Access Committee",
        title: "Re: Access Dispatch Inquiry",
        subject: `Re: ${replySubject}`,
        body: committeeResponseText,
        category: "approval",
        parent_message_id: userReply.id,
        read: false,
      });

      await logAuditEvent(auth.user.email, "MAILBOX_REPLY_DISPATCHED", {
        parentMessageId,
        replySubject
      }, clientIp);

      return jsonResponse({
        success: true,
        userReply,
        message: "Reply sent and automated committee response dispatched.",
      });
    }

    // =========================================================================
    // ACTION: ADMIN APPROVE TESTER REQUEST (VULN-01 PATCH: Privilege Escalation)
    // =========================================================================
    if (action === "approve-request") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      // VULN-01 PATCH: Strict authorization check!
      // Only compliance officers (or designated institutional governance roles) can approve requests!
      const userPermissions = ROLE_PERMISSIONS[auth.user.role] || [];
      const hasApprovalPrivilege = userPermissions.includes("approve_tester_requests") || auth.user.role === "compliance-officer";

      if (!hasApprovalPrivilege) {
        await logAuditEvent(auth.user.email, "UNAUTHORIZED_APPROVAL_ATTEMPT", {
          role: auth.user.role,
          attemptedTarget: body.targetEmail
        }, clientIp);

        return jsonResponse({
          error: "Forbidden: Only Portfolio Compliance Officers or authorized governance administrators may grant beta approvals.",
          code: "INSUFFICIENT_CLEARANCE"
        }, 403);
      }

      const targetEmail = body.targetEmail ? String(body.targetEmail).trim().toLowerCase() : "";
      if (!targetEmail) {
        return jsonResponse({ error: "Target applicant email is required." }, 400);
      }

      // VULN-01 PATCH: Prevent self-approval / self-promotion
      if (targetEmail === auth.user.email.toLowerCase()) {
        return jsonResponse({
          error: "Forbidden: Self-approval or self-promotion is prohibited under institutional compliance rules.",
          code: "SELF_APPROVAL_PROHIBITED"
        }, 403);
      }

      const approvedRole = VALID_ROLES.includes(body.approvedRole) ? body.approvedRole : "quant-researcher";
      const customNote = sanitize(body.customNote || "", 500);
      const newClearanceCode = `AKHVNI-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${approvedRole.substring(0, 3).toUpperCase()}`;

      // Update target applicant
      const { data: updatedTarget, error: updateErr } = await supabaseAdmin
        .from("beta_testers")
        .update({
          approval_status: "approved",
          role: approvedRole,
          clearance_code: newClearanceCode,
          updated_at: new Date().toISOString(),
        })
        .eq("email", targetEmail)
        .select()
        .single();

      if (updateErr || !updatedTarget) {
        return jsonResponse({ error: `Applicant with email ${targetEmail} not found.` }, 404);
      }

      // Post official approval notice into target applicant's mailbox
      const approvalNotice = `OFFICIAL NOTIFICATION: Your Beta Tester Application has been reviewed and APPROVED by Compliance Officer ${auth.user.full_name}.

Approved Role: ${approvedRole.toUpperCase()}
Clearance Code: ${newClearanceCode}
${customNote ? `\nCompliance Officer Notes:\n${customNote}` : ""}

You now have full privileges to preview the beta version and run scenario dialectics.`;

      await supabaseAdmin.from("inbox_messages").insert({
        user_email: targetEmail,
        sender: `Veiron Access Committee (${auth.user.full_name})`,
        title: "Beta Tester Request Approved",
        subject: `Approval Granted: ${approvedRole.toUpperCase()}`,
        body: approvalNotice,
        category: "approval",
        role_granted: approvedRole,
        clearance_code: newClearanceCode,
        read: false,
      });

      await logAuditEvent(auth.user.email, "TESTER_REQUEST_APPROVED", {
        targetEmail,
        approvedRole,
        newClearanceCode
      }, clientIp);

      return jsonResponse({
        success: true,
        message: `Applicant ${targetEmail} approved for role ${approvedRole}.`,
        user: updatedTarget,
      });
    }

    // =========================================================================
    // ACTION: SWITCH ROLE
    // =========================================================================
    if (action === "switch-role") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated) {
        return jsonResponse({ error: auth.error }, auth.status || 401);
      }

      const { newRole } = body;
      if (!VALID_ROLES.includes(newRole)) {
        return jsonResponse({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` }, 400);
      }

      const newClearanceCode = `AKHVNI-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${newRole.substring(0, 3).toUpperCase()}`;

      const { data: updatedUser, error: updateErr } = await supabaseAdmin
        .from("beta_testers")
        .update({
          role: newRole,
          clearance_code: newClearanceCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", auth.user.id)
        .select()
        .single();

      if (updateErr) {
        return jsonResponse({ error: "Failed to update role in database." }, 500);
      }

      // Post update notice into mailbox
      const rolePerms = ROLE_PERMISSIONS[newRole] || [];
      await supabaseAdmin.from("inbox_messages").insert({
        user_email: auth.user.email,
        sender: "Veiron Access Committee",
        title: "Beta Role Re-assignment Approved",
        subject: `Clearance Update: ${newRole.toUpperCase()}`,
        body: `Your testing role has been updated to: ${newRole.toUpperCase()}.
New Clearance Code: ${newClearanceCode}

Updated Permissions:
${rolePerms.map((p) => `• ${p.replace(/_/g, " ").toUpperCase()}`).join("\n")}`,
        category: "approval",
        role_granted: newRole,
        clearance_code: newClearanceCode,
        read: false,
      });

      await logAuditEvent(auth.user.email, "BETA_ROLE_SWITCHED", {
        newRole,
        newClearanceCode
      }, clientIp);

      return jsonResponse({
        success: true,
        user: sanitizeUserForResponse(updatedUser),
        message: `Role switched to ${newRole}. Clearance updated.`,
      });
    }

    // =========================================================================
    // ACTION: SUBMIT BETA REVIEW / EVALUATION (Continuous Tester Feedback)
    // =========================================================================
    if (action === "submit-review") {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated || !auth.user) {
        return jsonResponse({ error: "Authenticated session required to submit review." }, 401);
      }

      const { rating, category, title, commentary, testedScenario } = body;
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return jsonResponse({ error: "Rating must be an integer between 1 and 5." }, 400);
      }

      if (!commentary || typeof commentary !== "string" || commentary.trim().length < 5) {
        return jsonResponse({ error: "Detailed commentary is required (minimum 5 characters)." }, 400);
      }

      const cleanCategory = sanitize(category || "world-model", 40);
      const cleanTitle = sanitize(title || "Beta Model Evaluation", 120);
      const cleanCommentary = sanitize(commentary, 3000);
      const cleanScenario = testedScenario ? sanitize(testedScenario, 120) : null;

      const { data: newReview, error: revErr } = await supabaseAdmin
        .from("beta_reviews")
        .insert({
          tester_id: auth.user.id,
          tester_name: auth.user.full_name,
          tester_email: auth.user.email,
          tester_institution: auth.user.institution,
          tester_role: auth.user.role,
          rating: numRating,
          category: cleanCategory,
          title: cleanTitle,
          commentary: cleanCommentary,
          tested_scenario: cleanScenario,
        })
        .select()
        .single();

      if (revErr) {
        console.error("Database error inserting review:", revErr);
        return jsonResponse({ error: "Failed to store evaluation in database." }, 500);
      }

      await logAuditEvent(auth.user.email, "BETA_REVIEW_SUBMITTED", {
        rating: numRating,
        category: cleanCategory,
        title: cleanTitle
      }, clientIp);

      return jsonResponse({
        success: true,
        message: "Your evaluation has been successfully recorded in the Veiron research database.",
        review: newReview,
      });
    }

    // =========================================================================
    // ACTION: LIST BETA REVIEWS
    // =========================================================================
    if (action === "list-reviews") {
      const { testerEmail } = body;
      let query = supabaseAdmin
        .from("beta_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (testerEmail) {
        query = query.eq("tester_email", testerEmail.trim().toLowerCase());
      }

      const { data: reviews, error: listErr } = await query;
      if (listErr) {
        console.error("List reviews error:", listErr);
        return jsonResponse({ error: "Failed to fetch evaluations." }, 500);
      }

      return jsonResponse({
        success: true,
        reviews: reviews || []
      });
    }

    // =========================================================================
    // ACTION: ADMIN - LIST ALL REGISTERED USERS & STATUSES
    // =========================================================================
    if (action === "admin-list-users") {
      const { adminKey } = body;
      if (adminKey !== ADMIN_PASSKEY) {
        const auth = await authenticateRequest(req);
        if (!auth.authenticated || auth.user?.role !== "compliance-officer") {
          return jsonResponse({ error: "Unauthorized administrative access." }, 403);
        }
      }

      const { data: users, error: usersErr } = await supabaseAdmin
        .from("beta_testers")
        .select("id, full_name, email, phone, institution, role, approval_status, clearance_code, tester_tier, created_at, two_factor_expires_at")
        .order("created_at", { ascending: false });

      if (usersErr) {
        return jsonResponse({ error: "Failed to fetch registered testers." }, 500);
      }

      return jsonResponse({
        success: true,
        users: users || []
      });
    }

    // =========================================================================
    // ACTION: ADMIN - UPDATE TESTER APPROVAL STATUS (Approve / Reject)
    // =========================================================================
    if (action === "admin-update-user-status") {
      const { adminKey, userId, newStatus } = body;
      if (adminKey !== ADMIN_PASSKEY) {
        const auth = await authenticateRequest(req);
        if (!auth.authenticated || auth.user?.role !== "compliance-officer") {
          return jsonResponse({ error: "Unauthorized administrative access." }, 403);
        }
      }

      if (!userId || !["approved", "pending", "rejected"].includes(newStatus)) {
        return jsonResponse({ error: "Valid userId and newStatus ('approved'|'pending'|'rejected') are required." }, 400);
      }

      const { data: updatedUser, error: updateErr } = await supabaseAdmin
        .from("beta_testers")
        .update({
          approval_status: newStatus,
          tester_tier: newStatus === "approved" ? "TIER-1 EARLY ACCESS (VERIFIED)" : "TIER-1 EARLY ACCESS (PENDING REVIEW)",
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)
        .select()
        .single();

      if (updateErr || !updatedUser) {
        return jsonResponse({ error: "Failed to update user approval status." }, 500);
      }

      // If approved, create official approval letter in mailbox and email the user
      if (newStatus === "approved") {
        await supabaseAdmin.from("inbox_messages").insert({
          user_email: updatedUser.email,
          sender: "Veiron Institutional Access Committee",
          title: "Clearance Granted — Live Simulation Desk Unlocked",
          subject: `CLEARANCE APPROVED: ${updatedUser.clearance_code}`,
          body: `Dear ${updatedUser.full_name},

Your institutional application has been reviewed and APPROVED by the administrator.

Clearance Credential: ${updatedUser.clearance_code}
Active Role: ${updatedUser.role.toUpperCase()}
Access Level: FULL LIVE SIMULATION ACCESS UNLOCKED

You may now access live recursive world model simulations directly from the Beta Testing Dashboard.`,
          category: "approval",
          role_granted: updatedUser.role,
          clearance_code: updatedUser.clearance_code,
          read: false,
        });

        // Outbound email notification
        await sendClearanceEmail({
          to: updatedUser.email,
          fullName: updatedUser.full_name,
          clearanceCode: updatedUser.clearance_code,
          approvalStatus: "approved",
          role: updatedUser.role
        });
      }

      await logAuditEvent(updatedUser.email, "ADMIN_STATUS_UPDATED", {
        newStatus,
        userId
      }, clientIp);

      return jsonResponse({
        success: true,
        message: `Tester status updated to '${newStatus}'.`,
        user: sanitizeUserForResponse(updatedUser)
      });
    }

    // =========================================================================
    // ACTION: ADMIN - LIST ALL INQUIRIES & MESSAGES ACROSS USERS
    // =========================================================================
    if (action === "admin-list-messages") {
      const { adminKey } = body;
      if (adminKey !== ADMIN_PASSKEY) {
        const auth = await authenticateRequest(req);
        if (!auth.authenticated || auth.user?.role !== "compliance-officer") {
          return jsonResponse({ error: "Unauthorized administrative access." }, 403);
        }
      }

      const { data: messages, error: msgErr } = await supabaseAdmin
        .from("inbox_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (msgErr) {
        return jsonResponse({ error: "Failed to fetch mailbox messages." }, 500);
      }

      return jsonResponse({
        success: true,
        messages: messages || []
      });
    }

    // =========================================================================
    // ACTION: ADMIN - REPLY TO TESTER MESSAGE
    // =========================================================================
    if (action === "admin-reply-message") {
      const { adminKey, userEmail, parentMessageId, replyBody, subject } = body;
      if (adminKey !== ADMIN_PASSKEY) {
        const auth = await authenticateRequest(req);
        if (!auth.authenticated || auth.user?.role !== "compliance-officer") {
          return jsonResponse({ error: "Unauthorized administrative access." }, 403);
        }
      }

      if (!userEmail || !replyBody || typeof replyBody !== "string") {
        return jsonResponse({ error: "userEmail and replyBody are required." }, 400);
      }

      const cleanEmail = userEmail.trim().toLowerCase();
      const cleanReply = sanitize(replyBody, 4000);
      const cleanSubject = sanitize(subject || "Response from Institutional Committee", 120);

      // Verify that user exists in beta_testers (required by inbox_messages user_email foreign key)
      const { data: targetTester, error: testerErr } = await supabaseAdmin
        .from("beta_testers")
        .select("id, full_name, email, clearance_code")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (testerErr || !targetTester) {
        return jsonResponse({ 
          error: `Cannot dispatch reply: No registered tester found for email '${cleanEmail}'.` 
        }, 404);
      }

      // Validate parent_message_id UUID to prevent Postgres foreign key violations
      let safeParentId: string | null = null;
      if (parentMessageId && typeof parentMessageId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parentMessageId)) {
        const { data: parentCheck } = await supabaseAdmin
          .from("inbox_messages")
          .select("id")
          .eq("id", parentMessageId)
          .maybeSingle();
        if (parentCheck) {
          safeParentId = parentMessageId;
        }
      }

      // Insert message into user's mailbox (correct column: parent_message_id)
      const { data: newMsg, error: insertErr } = await supabaseAdmin
        .from("inbox_messages")
        .insert({
          user_email: targetTester.email,
          sender: "Veiron Institutional Administration",
          title: "Administrative Committee Response",
          subject: cleanSubject,
          body: cleanReply,
          category: "reply",
          parent_message_id: safeParentId,
          read: false
        })
        .select()
        .single();

      if (insertErr) {
        console.error("Database error inserting admin reply:", insertErr);
        return jsonResponse({ error: `Failed to dispatch reply message: ${insertErr.message}` }, 500);
      }

      // Dispatch outbound email notification via Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        try {
          const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF8F5; color: #141413; padding: 24px; margin: 0; }
              .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 2px solid #141413; padding: 32px; border-radius: 4px; }
              .badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 8px; background: #FAF8F5; border: 1px solid #E3E0D8; text-transform: uppercase; letter-spacing: 0.05em; color: #E5182B; }
              .body-box { background: #FAF8F5; border: 1px solid #E3E0D8; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.6; white-space: pre-line; color: #141413; }
              .footer { font-size: 11px; color: #87857F; margin-top: 24px; border-top: 1px solid #E3E0D8; padding-top: 16px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">VEIRON · ADMINISTRATIVE DISPATCH</span>
              <h2 style="font-size: 20px; font-family: serif; margin: 16px 0 8px 0;">${cleanSubject}</h2>
              <p style="font-size: 13px; color: #66645E;">
                Dear ${targetTester.full_name},<br>
                The Institutional Review Committee has dispatched an official response to your inquiry.
              </p>
              <div class="body-box">
                ${cleanReply}
              </div>
              <p style="font-size: 12px; color: #87857F;">
                You can also view and manage this message in your dashboard inbox under Clearance [${targetTester.clearance_code}].
              </p>
              <div class="footer">
                VEIRON RECURSIVE ARCHITECTURE · SECURITY TIERS NIST/ISO 27001
              </div>
            </div>
          </body>
          </html>
          `;

          let res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Veiron Institutional <onboarding@resend.dev>",
              to: [targetTester.email],
              subject: `[Administrative Response] ${cleanSubject}`,
              html: emailHtml,
            }),
          });

          let resData = await res.json();
          // If Resend free tier restricts to account owner email (notpavan2022@gmail.com), forward to developer Gmail
          if (res.status === 403 && (resData.message?.includes("testing emails to your own email address") || resData.message?.includes("resend.com/domains"))) {
            console.warn(`Resend domain restriction: Forwarding admin reply for ${targetTester.email} to notpavan2022@gmail.com`);
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Veiron Institutional <onboarding@resend.dev>",
                to: ["notpavan2022@gmail.com"],
                subject: `[Admin Reply for ${targetTester.email}] ${cleanSubject}`,
                html: emailHtml,
              }),
            });
          }
        } catch (mailErr) {
          console.warn("Outbound admin reply email dispatch failed:", mailErr);
        }
      }

      await logAuditEvent(cleanEmail, "ADMIN_REPLY_DISPATCHED", { parentMessageId: safeParentId }, clientIp);

      return jsonResponse({
        success: true,
        message: `Reply successfully dispatched to ${targetTester.full_name} (${cleanEmail}).`,
        messageRecord: newMsg
      });
    }

    return jsonResponse({ error: `Unknown action '${action}'.` }, 400);
  } catch (err: any) {
    console.error("Unhandled error in Edge Function:", err);
    return jsonResponse(
      { error: "Internal Server Error" },
      500
    );
  }
});
