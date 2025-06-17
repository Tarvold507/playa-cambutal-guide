
-- Add latitude and longitude columns to restaurant_listings if they don't exist
-- (They should already exist based on the schema, but let's make sure they're properly set up)

-- Add indexes for better performance on location-based queries
CREATE INDEX IF NOT EXISTS idx_restaurant_listings_coordinates 
ON restaurant_listings (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update the restaurant_listings table to ensure proper constraints
ALTER TABLE restaurant_listings 
ALTER COLUMN gallery_images SET DEFAULT '[]'::jsonb,
ALTER COLUMN menu_images SET DEFAULT '[]'::jsonb,
ALTER COLUMN hours SET DEFAULT '{}'::jsonb;
