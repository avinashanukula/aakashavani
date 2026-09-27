-- Add clearance retrieval rate limiting columns to beta_testers
ALTER TABLE public.beta_testers 
ADD COLUMN IF NOT EXISTS last_clearance_request_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS clearance_request_count INT DEFAULT 0;
