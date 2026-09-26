-- 1. Create beta_testers table
CREATE TABLE IF NOT EXISTS public.beta_testers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    institution TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('quant-researcher', 'macro-strategist', 'fx-rates-trader', 'dialectic-evaluator', 'compliance-officer')),
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    clearance_code TEXT NOT NULL,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    tester_tier TEXT NOT NULL DEFAULT 'TIER-1 EARLY ACCESS',
    session_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create inbox_messages table
CREATE TABLE IF NOT EXISTS public.inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL REFERENCES public.beta_testers(email) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('approval', 'system', 'regime_alert', 'reply', 'inquiry')),
    read BOOLEAN NOT NULL DEFAULT false,
    role_granted TEXT,
    clearance_code TEXT,
    parent_message_id UUID REFERENCES public.inbox_messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for all tables
ALTER TABLE public.beta_testers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated to execute via edge function (service role bypasses RLS)
CREATE POLICY "Service role full access on beta_testers" ON public.beta_testers
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on inbox_messages" ON public.inbox_messages
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on audit_logs" ON public.audit_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_testers_email ON public.beta_testers(email);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_user_email ON public.inbox_messages(user_email);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_created_at ON public.inbox_messages(created_at DESC);
