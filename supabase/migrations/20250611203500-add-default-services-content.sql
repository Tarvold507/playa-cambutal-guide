
-- Insert default services content for the Info page
INSERT INTO public.page_content (
  page_path,
  section_name,
  content_type,
  content_data,
  is_visible,
  display_order
) VALUES (
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
);
