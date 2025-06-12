
-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  unsubscribe_token text NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading own subscription (for unsubscribe)
CREATE POLICY "Allow reading by unsubscribe token" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (true);

-- Create policy to allow updating subscription status (for unsubscribe)
CREATE POLICY "Allow updating subscription status" 
  ON public.newsletter_subscriptions 
  FOR UPDATE 
  USING (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
