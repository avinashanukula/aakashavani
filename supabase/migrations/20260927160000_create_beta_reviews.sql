-- Migration: Create beta_reviews table and indexes
-- Supports continuous feedback and evaluations from beta testers

CREATE TABLE IF NOT EXISTS public.beta_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tester_id uuid REFERENCES public.beta_testers(id) ON DELETE CASCADE,
  tester_name text NOT NULL,
  tester_email text NOT NULL,
  tester_institution text,
  tester_role text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  category text NOT NULL, -- 'reasoning', 'adaptation', 'latency', 'ui', 'bug'
  title text NOT NULL,
  commentary text NOT NULL,
  tested_scenario text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_beta_reviews_created ON public.beta_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beta_reviews_tester ON public.beta_reviews(tester_id);
CREATE INDEX IF NOT EXISTS idx_beta_reviews_email ON public.beta_reviews(tester_email);

-- Enable RLS
ALTER TABLE public.beta_reviews ENABLE ROW LEVEL SECURITY;

-- Allow edge function (service_role or authenticated with anon) full management
CREATE POLICY "Allow public select on beta_reviews" ON public.beta_reviews
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on beta_reviews" ON public.beta_reviews
  FOR INSERT WITH CHECK (true);
