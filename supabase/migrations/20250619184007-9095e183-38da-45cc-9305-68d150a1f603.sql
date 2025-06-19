
-- Add foreign key constraint between blog_posts.user_id and profiles.id
ALTER TABLE blog_posts 
ADD CONSTRAINT blog_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
