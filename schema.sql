-- ==========================================
-- 1. テーブル作成
-- ==========================================

-- Users
CREATE TABLE public.users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  display_name text,
  avatar_url text,
  is_guest boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Posts
-- image_url カラムもここで作ります
CREATE TABLE public.posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  ui_type text NOT NULL CHECK (ui_type IN ('Article', 'Talk')),
  image_url text, 
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comments
CREATE TABLE public.comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tags
CREATE TABLE public.tags (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text UNIQUE NOT NULL
);

-- Post_Tags
CREATE TABLE public.post_tags (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, tag_id)
);

-- Messages
CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Post Likes
CREATE TABLE public.post_likes (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

-- ==========================================
-- 2. セキュリティ設定 (RLS & Policies)
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 全員に許可（開発用）
CREATE POLICY "Users access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Posts access" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Comments access" ON public.comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Tags access" ON public.tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Post_Tags access" ON public.post_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Messages access" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Post_Likes access" ON public.post_likes FOR ALL USING (true) WITH CHECK (true);