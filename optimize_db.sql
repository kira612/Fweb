-- ==========================================
-- Database Performance Optimization
-- ==========================================
-- このSQLスクリプトをSupabase SQL Editorで実行してください

-- ==========================================
-- 1. Posts テーブルのインデックス
-- ==========================================

-- ユーザーごとの投稿を素早く取得（プロフィールページなど）
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);

-- 投稿を日時順にソート（最新順表示）
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 投稿タイプでフィルタリング（Article/Talk別表示）
CREATE INDEX IF NOT EXISTS idx_posts_ui_type ON public.posts(ui_type);

-- 複合インデックス: タイプ別で日時順ソート
CREATE INDEX IF NOT EXISTS idx_posts_type_created ON public.posts(ui_type, created_at DESC);

-- ==========================================
-- 2. Post Tags テーブルのインデックス
-- ==========================================

-- 記事に紐づくタグを取得
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id);

-- タグに紐づく記事を検索
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);

-- ==========================================
-- 3. Comments テーブルのインデックス
-- ==========================================

-- 記事に紐づくコメントを取得
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- ユーザーのコメント履歴を取得
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- 日時順ソート用
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- ==========================================
-- 4. Post Likes テーブルのインデックス
-- ==========================================

-- 記事のいいね数をカウント
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);

-- ユーザーがいいねした記事を取得
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- ==========================================
-- 5. Tags テーブルのインデックス
-- ==========================================

-- タグ名で検索（既にUNIQUE制約があるがインデックスも確認）
-- UNIQUE制約は自動的にインデックスを作成するため、追加不要

-- ==========================================
-- 6. Messages テーブルのインデックス（将来のDM機能用）
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ==========================================
-- 確認クエリ
-- ==========================================
-- 作成されたインデックスを確認:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;
