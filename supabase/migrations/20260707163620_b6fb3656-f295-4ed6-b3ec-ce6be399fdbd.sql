CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  amount text NOT NULL,
  provenance text NOT NULL CHECK (provenance IN ('on-chain','off-chain')),
  tx_hash text,
  kind text NOT NULL DEFAULT 'transaction',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.activity_events TO anon;
GRANT SELECT, INSERT ON public.activity_events TO authenticated;
GRANT ALL ON public.activity_events TO service_role;

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read activity events (demo)"
  ON public.activity_events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert activity events (demo)"
  ON public.activity_events FOR INSERT
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
ALTER TABLE public.activity_events REPLICA IDENTITY FULL;

INSERT INTO public.activity_events (label, amount, provenance, tx_hash, kind) VALUES
  ('KYC Credential Issued', '—', 'on-chain', '0x8f3a2b1c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f80', 'credential'),
  ('EMI Auto-Pay · Home Loan', '−₹42,180', 'on-chain', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 'payment'),
  ('Salary Credit', '+₹1,25,000', 'off-chain', NULL, 'transaction'),
  ('Loan Approval · Officer L1', '—', 'on-chain', '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d', 'approval');