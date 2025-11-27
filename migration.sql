-- 1. Add ui_type column to posts if it doesn't exist
-- Note: You might need to run this separately if the column already exists, or ignore the error.
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS ui_type text CHECK (ui_type in ('Article', 'Talk'));

-- 2. Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

-- 3. Enable RLS for post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for post_likes
CREATE POLICY "Public post_likes are viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Everyone can insert post_likes" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can delete post_likes" ON public.post_likes FOR DELETE USING (true);
