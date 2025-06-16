
-- Add is_premium column to restaurant_listings table
ALTER TABLE public.restaurant_listings 
ADD COLUMN is_premium boolean NOT NULL DEFAULT false;

-- Add is_premium column to hotel_listings table
ALTER TABLE public.hotel_listings 
ADD COLUMN is_premium boolean NOT NULL DEFAULT false;

-- Add display_order column for fine-grained control within premium listings
ALTER TABLE public.restaurant_listings 
ADD COLUMN display_order integer DEFAULT 0;

ALTER TABLE public.hotel_listings 
ADD COLUMN display_order integer DEFAULT 0;
