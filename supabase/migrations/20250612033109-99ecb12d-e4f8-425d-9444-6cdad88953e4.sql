
-- Add closed_for_season column to restaurant_listings table
ALTER TABLE public.restaurant_listings 
ADD COLUMN closed_for_season boolean NOT NULL DEFAULT false;

-- Update existing records to have the default value
UPDATE public.restaurant_listings 
SET closed_for_season = false 
WHERE closed_for_season IS NULL;
