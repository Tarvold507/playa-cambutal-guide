
-- Add missing fields to adventure_business_listings table
ALTER TABLE adventure_business_listings 
ADD COLUMN website text,
ADD COLUMN address text;

-- Update location column to be nullable since we now have a separate address field
ALTER TABLE adventure_business_listings 
ALTER COLUMN location DROP NOT NULL;
