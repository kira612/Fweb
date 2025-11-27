# Schema Verification Report

## ✅ スキーマとクエリの整合性チェック完了

### 確認結果

すべてのクエリは現在の `schema.sql` と**完全に一致**しています。

---

## テーブル構造

### 現在のスキーマ (`schema.sql`)

1. **users**: `id`, `display_name`, `avatar_url`, `is_guest`, `created_at`
2. **posts**: `id`, `user_id`, `title`, `content`, `ui_type`, `created_at`, `updated_at`
3. **comments**: `id`, `post_id`, `user_id`, `content`, `created_at`
4. **tags**: `id`, `name`
5. **post_tags**: `post_id`, `tag_id` (composite primary key)
6. **messages**: `id`, `sender_id`, `receiver_id`, `content`, `is_read`, `created_at`
7. **post_likes**: `post_id`, `user_id`, `created_at` (composite primary key)

---

## クエリ検証

### ✅ `lib/services/posts.ts`
- **getPosts()**: 
  - テーブル: `posts`, `users`, `post_tags`, `tags`, `comments` ✅
  - カラム: すべて存在 ✅
  
- **getPostById(id)**:
  - テーブル: `posts`, `users`, `post_tags`, `tags` ✅
  - カラム: すべて存在 ✅

### ✅ `lib/services/comments.ts`
- **getCommentsByPostId(postId)**:
  - テーブル: `comments`, `users` ✅
  - カラム: すべて存在 ✅

### ✅ `app/actions/createPost.ts`
- テーブル: `users`, `posts`, `tags`, `post_tags` ✅
- 挿入カラム:
  - `users`: `display_name`, `is_guest`, `avatar_url` ✅
  - `posts`: `user_id`, `title`, `content`, `ui_type` ✅
  - `tags`: `name` ✅
  - `post_tags`: `post_id`, `tag_id` ✅

### ✅ `app/actions/deletePost.ts`
- テーブル: `posts` ✅
- SELECT: `user_id` ✅
- DELETE: `id`でフィルタリング ✅

---

## 外部キー制約

すべてのテーブルの外部キーに `ON DELETE CASCADE` が設定されています：

- `posts.user_id` → `users.id` (ON DELETE CASCADE) ✅
- `comments.post_id` → `posts.id` (ON DELETE CASCADE) ✅
- `comments.user_id` → `users.id` (ON DELETE CASCADE) ✅
- `post_tags.post_id` → `posts.id` (ON DELETE CASCADE) ✅
- `post_tags.tag_id` → `tags.id` (ON DELETE CASCADE) ✅
- `post_likes.post_id` → `posts.id` (ON DELETE CASCADE) ✅
- `post_likes.user_id` → `users.id` (ON DELETE CASCADE) ✅

---

## RLS (Row Level Security) ポリシー

### 必要なポリシー（`schema.sql`に定義済み）

- **posts**: SELECT, INSERT, UPDATE, **DELETE** ✅
- **comments**: SELECT, INSERT, **DELETE** ✅
- **post_tags**: SELECT, INSERT, **DELETE** ✅
- **post_likes**: SELECT, INSERT, **DELETE** ✅
- **tags**: SELECT, INSERT ✅
- **users**: SELECT, INSERT ✅
- **messages**: SELECT, INSERT, DELETE ✅

---

## 注意点

### `post_likes` テーブル
- **スキーマに存在**していますが、**コードでは使用されていません**
- Like機能は削除されていますが、テーブル定義はschema.sqlに残っています
- 影響: なし（使用されていないため）

---

## 削除機能の問題について

スキーマとクエリは完全に一致しているため、削除が動作しない原因は以下のいずれかです：

1. **Supabase側でRLSポリシーが適用されていない**
   - `schema.sql`をSupabase SQL Editorで実行しましたか？
   
2. **外部キー制約が適用されていない**
   - 古いテーブルを削除して、`schema.sql`を再実行する必要があるかもしれません

3. **サーバーアクションのエラーが発生している**
   - ターミナルのログ `[deletePost]` を確認してください
