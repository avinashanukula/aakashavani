-- Security Hardening Migration
-- 1. Add session expiration and access credential fields to beta_testers
ALTER TABLE public.beta_testers 
    ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now() + interval '7 days'),
    ADD COLUMN IF NOT EXISTS access_secret TEXT;

-- 2. Index session_token and session_expires_at for fast, secure lookup
CREATE INDEX IF NOT EXISTS idx_beta_testers_session_token ON public.beta_testers(session_token);
CREATE INDEX IF NOT EXISTS idx_beta_testers_session_expires_at ON public.beta_testers(session_expires_at);

-- 3. Explicit Privilege Lockdown:
-- Revoke direct permissions from anon and authenticated roles on all public schema tables.
-- All database traffic MUST transit via the deployed Edge Function running with service_role privileges.
REVOKE ALL ON public.beta_testers FROM anon, authenticated;
REVOKE ALL ON public.inbox_messages FROM anon, authenticated;
REVOKE ALL ON public.audit_logs FROM anon, authenticated;

-- Ensure service_role has explicit full privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beta_testers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inbox_messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO service_role;
