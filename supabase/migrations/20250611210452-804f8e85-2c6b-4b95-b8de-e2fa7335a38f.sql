
-- First, let's see what we currently have and clean up any duplicate or incorrectly named entries
DELETE FROM public.page_content 
WHERE page_path = '/info' 
AND section_name IN ('Service', 'Servicead', 'Services');

-- If there's already a 'services' entry, we'll update it to include any new services
-- If not, the migration file will create the default one
-- Let's make sure we have the correct services entry by inserting it if it doesn't exist
INSERT INTO public.page_content (
  page_path,
  section_name,
  content_type,
  content_data,
  is_visible,
  display_order
) 
SELECT 
  '/info',
  'services',
  'services',
  '{
    "title": "Local Services",
    "services": [
      {
        "name": "Emergency Services",
        "icon": "Stethoscope",
        "details": "24/7 medical emergency services and local clinic information for urgent healthcare needs."
      },
      {
        "name": "Surf Lessons",
        "icon": "Waves", 
        "details": "Professional surf instruction for all skill levels with certified local instructors."
      },
      {
        "name": "Car Rental",
        "icon": "Car",
        "details": "Local vehicle rental services including cars, ATVs, and motorcycles for exploring the area."
      },
      {
        "name": "Security Services",
        "icon": "ShieldCheck",
        "details": "Local security services and safety information for residents and visitors."
      },
      {
        "name": "Language Classes",
        "icon": "School",
        "details": "Spanish language classes and cultural exchange programs for expatriates."
      },
      {
        "name": "Maintenance Services",
        "icon": "Wrench",
        "details": "Property maintenance, repairs, and handyman services for homes and businesses."
      }
    ]
  }'::jsonb,
  true,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.page_content 
  WHERE page_path = '/info' AND section_name = 'services'
);
