-- Create crypto_transactions table to track payment verifications
CREATE TABLE public.crypto_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL,
  crypto_type TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  crypto_amount TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  CONSTRAINT valid_crypto_type CHECK (crypto_type IN ('BTC', 'ETH', 'USDT')),
  CONSTRAINT valid_status CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.crypto_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON public.crypto_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.crypto_transactions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all transactions
CREATE POLICY "Admins can update all transactions"
ON public.crypto_transactions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_crypto_transactions_updated_at
BEFORE UPDATE ON public.crypto_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_crypto_transactions_user_id ON public.crypto_transactions(user_id);
CREATE INDEX idx_crypto_transactions_status ON public.crypto_transactions(verification_status);
CREATE INDEX idx_crypto_transactions_application_id ON public.crypto_transactions(application_id);