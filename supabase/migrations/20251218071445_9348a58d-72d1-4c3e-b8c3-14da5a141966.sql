-- Add purpose column to crypto_transactions
ALTER TABLE public.crypto_transactions 
ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'investment';

-- Add user_email column to withdrawal_requests  
ALTER TABLE public.withdrawal_requests 
ADD COLUMN IF NOT EXISTS user_email text;

-- Update the tier calculation trigger to handle tier upgrades properly
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_invested numeric;
  new_tier integer;
  upgrade_tier integer;
BEGIN
  -- Only process if transaction is being verified (status changing to verified)
  IF NEW.verification_status = 'verified' AND (TG_OP = 'INSERT' OR OLD.verification_status != 'verified') THEN
    
    -- Handle tier upgrades directly - set tier based on payment amount
    IF NEW.purpose = 'tier-upgrade' THEN
      -- Determine which tier they're upgrading to based on amount
      IF NEW.amount_usd >= 3500 THEN
        upgrade_tier := 3; -- VIP Legacy
      ELSIF NEW.amount_usd >= 1000 THEN
        upgrade_tier := 2; -- Quantum Leap
      ELSE
        upgrade_tier := 1;
      END IF;
      
      -- Update profile to the new tier (only if higher than current)
      UPDATE public.profiles
      SET tier_level = GREATEST(tier_level, upgrade_tier)
      WHERE user_id = NEW.user_id;
      
    ELSE
      -- For investments, calculate total and derive tier from that
      SELECT COALESCE(SUM(amount_usd), 0) INTO total_invested
      FROM public.crypto_transactions
      WHERE user_id = NEW.user_id 
        AND verification_status = 'verified'
        AND purpose = 'investment';
      
      -- Calculate new tier based on investment total
      new_tier := public.calculate_tier(total_invested);
      
      -- Update profile with new tier and total investment
      UPDATE public.profiles
      SET tier_level = GREATEST(tier_level, new_tier),
          total_investment = total_invested
      WHERE user_id = NEW.user_id;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS update_tier_on_verification ON public.crypto_transactions;
CREATE TRIGGER update_tier_on_verification
  AFTER INSERT OR UPDATE ON public.crypto_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_tier();