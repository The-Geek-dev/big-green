-- Create cybertruck_orders table for tracking Cybertruck customization orders
CREATE TABLE public.cybertruck_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  model TEXT NOT NULL DEFAULT 'all-wheel-drive',
  color TEXT NOT NULL DEFAULT 'stainless-steel',
  interior TEXT NOT NULL DEFAULT 'dark',
  accessories TEXT[] DEFAULT '{}',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  token_key TEXT,
  token_key_verified BOOLEAN NOT NULL DEFAULT false,
  token_payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cybertruck_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own orders" 
ON public.cybertruck_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
ON public.cybertruck_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders" 
ON public.cybertruck_orders 
FOR UPDATE 
USING (auth.uid() = user_id AND order_status = 'pending');

-- Admin policies
CREATE POLICY "Admins can view all orders" 
ON public.cybertruck_orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all orders" 
ON public.cybertruck_orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_cybertruck_orders_updated_at
BEFORE UPDATE ON public.cybertruck_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create cybertruck_tokens table for token key management
CREATE TABLE public.cybertruck_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_key TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID,
  used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.cybertruck_tokens ENABLE ROW LEVEL SECURITY;

-- Admin policies for tokens
CREATE POLICY "Admins can view all tokens" 
ON public.cybertruck_tokens 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert tokens" 
ON public.cybertruck_tokens 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tokens" 
ON public.cybertruck_tokens 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tokens" 
ON public.cybertruck_tokens 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view tokens to validate them
CREATE POLICY "Users can view valid tokens for validation" 
ON public.cybertruck_tokens 
FOR SELECT 
USING (is_used = false AND (expires_at IS NULL OR expires_at > now()));