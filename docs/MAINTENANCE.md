# Campus Connect - 保守・運用ドキュメント

## 📋 目次

1. [システム概要](#システム概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [セットアップ手順](#セットアップ手順)
4. [機能一覧](#機能一覧)
5. [データベース構造](#データベース構造)
6. [コンポーネント設計](#コンポーネント設計)
7. [トラブルシューティング](#トラブルシューティング)
8. [デプロイ手順](#デプロイ手順)
9. [メンテナンス作業](#メンテナンス作業)

---

## システム概要

### プロジェクト情報
- **プロジェクト名**: Campus Connect
- **目的**: 大学生向けコミュニティプラットフォーム
- **技術スタック**: Next.js 14, Supabase, TypeScript, Tailwind CSS

### 主要機能
1. 記事投稿（Article/Talk形式）
2. 画像アップロード
3. タグ付けと検索
4. コメント機能
5. いいね機能
6. ユーザープロフィール管理

---

## アーキテクチャ

### ディレクトリ構成

```
Fban/
├── app/
│   ├── actions/            # Server Actions
│   │   ├── createPost.ts   # 記事作成
│   │   ├── deletePost.ts   # 記事削除
│   │   └── updateProfile.ts # プロフィール更新
│   ├── api/                # API Routes
│   │   ├── login/          # ログイン
│   │   ├── register/       # 登録
│   │   └── profile/        # プロフィール更新
│   ├── posts/
│   │   ├── [id]/          # 記事詳細
│   │   └── new/           # 記事作成
│   ├── search/            # 検索
│   └── profile/           # プロフィール
├── components/
│   ├── AppHeader.tsx      # 共通ヘッダー
│   ├── PostCard.tsx       # 記事カード
│   ├── TagList.tsx        # タグリスト
│   ├── UserAvatar.tsx     # ユーザーアバター
│   ├── CommentList.tsx    # コメント一覧
│   ├── CommentForm.tsx    # コメント投稿
│   ├── SearchInput.tsx    # 検索入力
│   ├── DeleteButton.tsx   # 削除ボタン
│   ├── LikeButton.tsx     # いいねボタン
│   └── ui/                # UIコンポーネント
├── lib/
│   ├── auth/
│   │   └── auth.ts        # 認証サービス
│   ├── services/
│   │   ├── posts.ts       # 記事関連
│   │   ├── comments.ts    # コメント関連
│   │   ├── tags.ts        #タグ関連
│   │   ├── likes.ts       # いいね関連
│   │   └── search.ts      # 検索関連
│   └── utils.ts           # ユーティリティ
├── types/
│   └── index.ts           # 型定義
├── schema.sql             # データベーススキーマ
└── storage_post_images.sql # ストレージ設定

```

### 技術スタック詳細

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| フロントエンド | Next.js 14 | Reactフレームワーク |
| バックエンド | Next.js Server Actions | サーバーサイド処理 |
| データベース | Supabase (PostgreSQL) | データ永続化 |
| ストレージ | Supabase Storage | 画像保存 |
| 認証 | Cookie-based (将来: Supabase Auth) | ユーザー認証 |
| スタイリング | Tailwind CSS + Shadcn/ui | UIデザイン |
| 言語 | TypeScript | 型安全性 |

---

## セットアップ手順

### 1. 環境変数設定

`.env.local` ファイルを作成：

``bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. データベース初期化

Supabase SQL Editorで以下を実行：

```bash
# 1. メインスキーマ
cat schema.sql | pbcopy  # コピーして実行

# 2. ストレージ設定
cat storage_setup.sql | pbcopy  # アバター用
cat storage_post_images.sql | pbcopy  # 記事画像用
```

### 3. 依存関係インストール

```bash
npm install
```

### 4. 開発サーバー起動

```bash
npm run dev
```

---

## 機能一覧

### 1. 記事投稿システム

**場所**: `app/posts/new/page.tsx`, `app/actions/createPost.ts`

**機能**:
- タイトル、本文入力
- Article/Talk選択
- タグ追加（複数可）
- 画像アップロード（任意）

**フロー**:
1. ユーザーがフォーム入力
2. `createPost` Server Actionが実行
3. 画像があればSupabase Storageにアップロード
4. `posts`テーブルに挿入
5. タグを`tags`/`post_tags`テーブルに保存
6. 記事詳細ページにリダイレクト

### 2. 検索システム

**場所**: `app/search/page.tsx`, `lib/services/search.ts`

**検索タイプ**:
- キーワード検索: タイトル・本文から検索
- タグ検索: 特定タグの記事を表示

**URL例**:
```
/search?q=プログラミング    # キーワード検索
/search?tag=楽単             # タグ検索
```

### 3. ユーザー認証

**場所**: `lib/auth/auth.ts`, `app/api/login`, `app/api/register`

**現在の仕組み**:
- Cookieベースの簡易認証
- `user_id` cookieで識別
- ゲストユーザー自動作成

**将来の移行先**:
- Supabase Auth (詳細は`docs/AUTH_MIGRATION.md`参照)

### 4. プロフィール管理

**場所**: `app/profile/page.tsx`, `components/ProfileForm.tsx`

**機能**:
- 表示名変更
- アバター画像アップロード
- ログイン/登録

---

## データベース構造

### テーブル一覧

#### 1. users (ユーザー)
```sql
id uuid PRIMARY KEY
display_name text
avatar_url text
is_guest boolean
created_at timestamp
```

#### 2. posts (記事)
```sql
id uuid PRIMARY KEY
user_id uuid REFERENCES users
title text NOT NULL
content text NOT NULL
ui_type text CHECK (IN ('Article', 'Talk'))
image_url text              -- ★画像URL
created_at timestamp
updated_at timestamp
```

#### 3. comments (コメント)
```sql
id uuid PRIMARY KEY
post_id uuid REFERENCES posts
user_id uuid REFERENCES users
content text NOT NULL
created_at timestamp
```

#### 4. tags (タグ)
```sql
id uuid PRIMARY KEY
name text UNIQUE NOT NULL
```

#### 5. post_tags (記事-タグ中間テーブル)
```sql
post_id uuid REFERENCES posts
tag_id uuid REFERENCES tags
PRIMARY KEY (post_id, tag_id)
```

#### 6. post_likes (いいね)
```sql
post_id uuid REFERENCES posts
user_id uuid REFERENCES users
created_at timestamp
PRIMARY KEY (post_id, user_id)
```

### RLSポリシー

現在は**開発用**に全員許可モード：

```sql
CREATE POLICY "access" ON table_name 
FOR ALL USING (true) WITH CHECK (true);
```

> [!WARNING]
> 本番環境では適切なRLSポリシーに変更すること

---

## コンポーネント設計

### 共通コンポーネント

#### AppHeader
**ファイル**: `components/AppHeader.tsx`

**Props**:
```typescript
{
  currentUser?: User | null
  title?: string
}
```

**使用例**:
```tsx
<AppHeader currentUser={currentUser} />
```

#### TagList
**ファイル**: `components/TagList.tsx`

**Props**:
```typescript
{
  tags: Tag[]
  title?: string
}
```

**使用例**:
```tsx
<TagList tags={popularTags} title="人気のタグ" />
```

#### PostCard
**ファイル**: `components/PostCard.tsx`

**Props**:
```typescript
{
  post: Post  // image_url含む
}
```

**表示内容**:
- 画像（あれば）
- タイトル
- 投稿者・日時
- タグ
- コメント数

---

## トラブルシューティング

### 1. ビルドエラー

**症状**: `next build`が失敗

**確認事項**:
```bash
# 型エラー確認
npx tsc --noEmit

# 依存関係確認
npm install

# キャッシュクリア
rm -rf .next
```

### 2. 画像アップロード失敗

**症状**: 画像が表示されない

**確認手順**:
1. Supabase Storageで`post_images`バケット存在確認
2. `storage_post_images.sql`実行済み確認
3. RLSポリシー確認：
   ```sql
   SELECT * FROM storage.policies 
   WHERE bucket_id = 'post_images';
   ```

### 3. 認証エラー

**症状**: ユーザーがログインできない

**デバッグ**:
```typescript
// app/profile/page.tsx にログ追加
const userId = cookieStore.get('user_id')?.value
console.log('User ID:', userId)  // 一時的に確認
```

### 4. データ取得エラー

**症状**: 記事が表示されない

**確認**:
```sql
-- データ存在確認
SELECT * FROM posts LIMIT 10;

-- RLS確認
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

---

## デプロイ手順

### Vercelデプロイ

1. **リポジトリ接続**
```bash
vercel link
```

2. **環境変数設定**
Vercel Dashboardで設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **デプロイ**
```bash
vercel --prod
```

### ビルドコマンド

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## メンテナンス作業

### 定期メンテナンス

#### 1. データベースバックアップ
Supabase Dashboardから週次で実施

#### 2. ログ確認
Vercel Logs/Supabase Logsで月次確認

#### 3. 依存関係更新
```bash
npm outdated
npm update
```

### パフォーマンス最適化

#### 画像最適化
- Next.js Image component使用済み
- Supabase  Storage CDN有効

#### データベースインデックス
```sql
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

---

## セキュリティ

### 現在の実装

- [x] HttpOnly Cookie使用
- [x] CSRF保護（Next.js標準）
- [x] XSS対策（React自動エスケープ）
- [ ] Supabase RLS（開発用全許可）
- [ ] Supabase Auth未導入

### 本番環境への移行前チェックリスト

- [ ] RLSポリシーを適切に設定
- [ ] Supabase Authへ移行 (`docs/AUTH_MIGRATION.md`参照)
- [ ] 環境変数の保護
- [ ] HTTPS強制
- [ ] レート制限設定

---

## 連絡先・サポート

### ドキュメント
- [認証移行ガイド](./AUTH_MIGRATION.md)
- [API仕様書](./README.md)

### 更新履歴
- 2025-11-28: 初版作成
- 2025-11-28: 画像アップロード機能追加
- 2025-11-28: コンポーネントリファクタリング

---

**Last Updated**: 2025-11-28  
**Version**: 1.0.0
