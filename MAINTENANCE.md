# メンテナンス・仕様書 (MAINTENANCE.md)

本ドキュメントは、Campus Connectのシステム構成、機能仕様、および保守運用に関する情報をまとめたものです。

## 技術スタック

- **Frontend Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend / Database**: Supabase (PostgreSQL, Auth, Storage)
- **Infrastructure**: Docker

## 機能仕様

### 1. 投稿機能
- **Articleモード**: Markdown記法、数式（KaTeX）、画像埋め込み、表組みに対応したリッチな記事投稿。
- **Talkモード**: タイトルのみの短文投稿。チャット感覚での利用を想定。

### 2. 認証機能
- **Supabase Auth**: メールアドレス/パスワード認証に加え、GitHub/Google等のソーシャルログインに対応。
- **ユーザー名認証**: 内部的にはメールアドレスを使用するが、ユーザーには「ユーザー名」でのログイン体験を提供（メールアドレス不要の登録フローを独自実装）。
- **ルート保護**: 未ログインユーザーは投稿作成やお気に入り登録などのアクションが制限される。

### 3. 検索機能
- **キーワード検索**: 記事のタイトルと本文を対象とした検索。
- **タグ検索**: 記事に付与されたタグによる絞り込み。

### 4. お気に入り機能
- 記事をお気に入りに登録し、マイページや専用一覧ページで確認可能。

## データベース設計 (スキーマ概要)

### 主要テーブル

| テーブル名 | 役割 | 備考 |
| :--- | :--- | :--- |
| `users` | ユーザー情報の管理 | `auth.users` とトリガーで同期 |
| `posts` | 記事データの管理 | `ui_type` で Article/Talk を区別 |
| `comments` | 記事へのコメント | |
| `tags` | タグのマスターデータ | |
| `post_tags` | 記事とタグの中間テーブル | 多対多リレーション |
| `post_likes` | 記事へのいいね（お気に入り） | |
| `messages` | ユーザー間メッセージ | 送信者・受信者・既読状態を管理 |

### 5. ダイレクトメッセージ (DM) 機能
- **リアルタイムチャット**: Supabase Realtimeを使用し、メッセージの即時送受信を実現。
- **受信トレイ**: 過去の会話履歴を一覧表示し、未読メッセージがある会話にはバッジを表示。
- **通知**: ヘッダーのアイコンに未読メッセージの総数をリアルタイムで表示。

### 6. ゲストユーザー対応
- **閲覧**: 制限なし。
- **アクション制限**: コメント投稿やいいね！ボタン押下時に、ログイン誘導モーダル (`LoginAlertModal`) を表示してブロック。

### セキュリティ (RLS)

Row Level Security (RLS) により、データベースレベルでアクセス制御を行っています。

- **SELECT (閲覧)**: 基本的に全ユーザー（未ログイン含む）に許可。
- **INSERT (作成)**: ログイン済みユーザー (`authenticated`) のみ許可。
- **UPDATE/DELETE (更新・削除)**: リソースの所有者 (`user_id = auth.uid()`) のみ許可。

## ディレクトリ構造

```
app/
  actions/       # Server Actions (バックエンドロジック)
  api/           # Route Handlers (APIエンドポイント)
  auth/          # 認証関連ルート (callbackなど)
  posts/         # 記事関連ページ
  profile/       # プロフィールページ
  ...
components/
  features/      # 機能単位のコンポーネント
    home/        # トップページ用 (PostFeed, Sidebar)
    post-detail/ # 記事詳細用 (PostHeader, PostContent)
    ...
  ui/            # 汎用UIパーツ (Button, Input, Badgeなど)
lib/
  services/      # データ取得・操作ロジック (Supabaseクエリの隠蔽)
types/           # 共通型定義 (User, Post, Commentなど)
utils/           # ユーティリティ (Supabaseクライアント作成など)
```

## 保守・運用

### パフォーマンス
- 主要な検索クエリ（`user_id`, `created_at`, `ui_type` 等）に対してインデックスを作成済みです。
- 未読メッセージカウントの高速化のため、`messages(receiver_id) WHERE is_read = false` の部分インデックスを追加しました。
- 投稿一覧取得 (`getPosts`) では、ペイロード削減のため本文 (`content`) を取得しないように最適化されています。
- クエリが遅くなった場合は、`schema.sql` のインデックス定義を見直してください。

### 画像トラブルシューティング
- 画像が表示されない場合、Supabase Storageのバケット設定（Public access）と、`next.config.js` の `remotePatterns` 設定を確認してください。
