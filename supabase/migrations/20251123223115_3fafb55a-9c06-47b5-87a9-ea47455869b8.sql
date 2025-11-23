-- Create tokens table
CREATE TABLE public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_code TEXT NOT NULL UNIQUE,
  application_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT valid_application_type CHECK (application_type IN ('grant application', 'investment', 'business funding', 'donation'))
);

-- Enable RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active tokens"
ON public.tokens
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert tokens"
ON public.tokens
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tokens"
ON public.tokens
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tokens"
ON public.tokens
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add token field to applications table
ALTER TABLE public.applications
ADD COLUMN token_code TEXT;

-- Create function to validate and consume token
CREATE OR REPLACE FUNCTION public.validate_and_consume_token(
  _token_code TEXT,
  _application_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token_record RECORD;
BEGIN
  -- Get token details
  SELECT * INTO token_record
  FROM public.tokens
  WHERE token_code = _token_code
    AND application_type = _application_type
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  FOR UPDATE;

  -- Check if token exists and is valid
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if token has reached max uses
  IF token_record.max_uses IS NOT NULL AND token_record.current_uses >= token_record.max_uses THEN
    RETURN false;
  END IF;

  -- Increment usage count
  UPDATE public.tokens
  SET current_uses = current_uses + 1
  WHERE token_code = _token_code;

  RETURN true;
END;
$$;