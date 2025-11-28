-- Create post_images bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to view post images
CREATE POLICY "Public post images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'post_images');

-- Policy: Allow everyone to upload post images
CREATE POLICY "Anyone can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post_images');

-- Policy: Allow everyone to update post images
CREATE POLICY "Anyone can update post images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'post_images');

-- Policy: Allow everyone to delete post images
CREATE POLICY "Anyone can delete post images"
ON storage.objects FOR DELETE
USING (bucket_id = 'post_images');
