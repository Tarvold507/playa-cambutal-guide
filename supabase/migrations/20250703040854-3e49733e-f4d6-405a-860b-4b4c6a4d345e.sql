-- Add slug columns to hotel_listings and restaurant_listings tables
-- This is critical for SEO and dynamic route prerendering

-- Add slug column to hotel_listings
ALTER TABLE public.hotel_listings 
ADD COLUMN slug text;

-- Add slug column to restaurant_listings  
ALTER TABLE public.restaurant_listings
ADD COLUMN slug text;

-- Create function to generate URL-friendly slugs
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s\-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$;

-- Update existing hotel listings with generated slugs
UPDATE public.hotel_listings 
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Update existing restaurant listings with generated slugs  
UPDATE public.restaurant_listings
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Make slug columns required and unique
ALTER TABLE public.hotel_listings 
ALTER COLUMN slug SET NOT NULL,
ADD CONSTRAINT hotel_listings_slug_unique UNIQUE (slug);

ALTER TABLE public.restaurant_listings
ALTER COLUMN slug SET NOT NULL,
ADD CONSTRAINT restaurant_listings_slug_unique UNIQUE (slug);

-- Create trigger function to auto-generate slugs for new records
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.name);
  END IF;
  
  -- Ensure uniqueness by appending counter if needed
  DECLARE
    base_slug text := NEW.slug;
    counter integer := 1;
    table_name text := TG_TABLE_NAME;
  BEGIN
    WHILE EXISTS (
      SELECT 1 FROM hotel_listings WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      UNION ALL
      SELECT 1 FROM restaurant_listings WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) LOOP
      NEW.slug = base_slug || '-' || counter;
      counter = counter + 1;
    END LOOP;
  END;
  
  RETURN NEW;
END;
$$;

-- Add triggers to auto-generate slugs
CREATE TRIGGER hotel_listings_slug_trigger
  BEFORE INSERT OR UPDATE ON public.hotel_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

CREATE TRIGGER restaurant_listings_slug_trigger  
  BEFORE INSERT OR UPDATE ON public.restaurant_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();