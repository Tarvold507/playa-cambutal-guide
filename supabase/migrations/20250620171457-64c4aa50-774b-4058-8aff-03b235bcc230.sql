
-- Create the seo-files storage bucket for SEO file deployment
INSERT INTO storage.buckets (id, name, public)
VALUES ('seo-files', 'seo-files', true)
ON CONFLICT (id) DO NOTHING;
