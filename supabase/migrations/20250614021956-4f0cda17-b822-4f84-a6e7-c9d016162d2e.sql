
-- Add RLS policies to allow authenticated users to manage SEO data
-- This enables auto-generation while maintaining security

-- Policy for SELECT - allow authenticated users to read SEO data
CREATE POLICY "Authenticated users can view SEO data" 
ON public.page_seo 
FOR SELECT 
TO authenticated 
USING (true);

-- Policy for INSERT - allow authenticated users to create SEO data
CREATE POLICY "Authenticated users can create SEO data" 
ON public.page_seo 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy for UPDATE - allow authenticated users to update SEO data
CREATE POLICY "Authenticated users can update SEO data" 
ON public.page_seo 
FOR UPDATE 
TO authenticated 
USING (true);

-- Policy for DELETE - only admins can delete SEO data
CREATE POLICY "Only admins can delete SEO data" 
ON public.page_seo 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on the page_seo table if not already enabled
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
