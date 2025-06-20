
-- Create RLS policies for the seo-files storage bucket

-- Allow admins to insert files into the seo-files bucket
CREATE POLICY "Admins can upload SEO files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'seo-files' AND 
  has_role(auth.uid(), 'admin'::user_role)
);

-- Allow public read access to SEO files (needed for public SEO pages)
CREATE POLICY "Public can view SEO files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'seo-files');

-- Allow admins to update SEO files
CREATE POLICY "Admins can update SEO files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'seo-files' AND 
  has_role(auth.uid(), 'admin'::user_role)
)
WITH CHECK (
  bucket_id = 'seo-files' AND 
  has_role(auth.uid(), 'admin'::user_role)
);

-- Allow admins to delete SEO files
CREATE POLICY "Admins can delete SEO files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'seo-files' AND 
  has_role(auth.uid(), 'admin'::user_role)
);
