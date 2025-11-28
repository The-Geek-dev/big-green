-- Add tier tracking columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tier_level integer NOT NULL DEFAULT 1 CHECK (tier_level >= 1 AND tier_level <= 3),
ADD COLUMN total_investment numeric NOT NULL DEFAULT 0;

-- Create function to calculate tier based on investment amount
CREATE OR REPLACE FUNCTION public.calculate_tier(investment_amount numeric)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF investment_amount >= 10000 THEN
    RETURN 3; -- VIP Legacy
  ELSIF investment_amount >= 1000 THEN
    RETURN 2; -- Quantum Leap
  ELSE
    RETURN 1; -- Gateway
  END IF;
END;
$$;

-- Create function to update user tier when transactions are verified
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_invested numeric;
  new_tier integer;
BEGIN
  -- Only process if transaction is being verified (status changing to verified)
  IF NEW.verification_status = 'verified' AND (TG_OP = 'INSERT' OR OLD.verification_status != 'verified') THEN
    -- Calculate total verified investments for this user
    SELECT COALESCE(SUM(amount_usd), 0) INTO total_invested
    FROM public.crypto_transactions
    WHERE user_id = NEW.user_id AND verification_status = 'verified';
    
    -- Calculate new tier
    new_tier := public.calculate_tier(total_invested);
    
    -- Update profile with new tier and total investment
    UPDATE public.profiles
    SET tier_level = new_tier,
        total_investment = total_invested
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update tier on transaction verification
CREATE TRIGGER update_tier_on_transaction_verification
AFTER INSERT OR UPDATE OF verification_status ON public.crypto_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_user_tier();