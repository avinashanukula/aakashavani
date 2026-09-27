-- Add 2-Step Verification Support to beta_testers
ALTER TABLE public.beta_testers 
ADD COLUMN IF NOT EXISTS two_factor_code text,
ADD COLUMN IF NOT EXISTS two_factor_expires_at timestamptz;

-- Ensure default approval_status is 'pending'
ALTER TABLE public.beta_testers 
ALTER COLUMN approval_status SET DEFAULT 'pending';
