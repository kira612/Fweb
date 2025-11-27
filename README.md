# Campus Connect

**Campus Connect** は、大学生が情報を共有し、質問し、仲間とつながるためのソーシャルプラットフォームです。

## 機能

- **投稿作成**: 考えや記事を共有できます。
    - **Talk モード**: 気軽なつぶやきや簡単な質問に。
    - **Article モード**: 体系的な知識や経験の共有に。
- **タグシステム**: コンテンツをタグ（例: #楽単, #プログラミング）で整理。
- **ゲストアクセス**: 新規ユーザーには自動的にゲストプロフィールを作成。
- **モダンな UI**: Tailwind CSS と Shadcn UI を使用した、クリーンでレスポンシブなデザイン。

## 技術スタック

- **フロントエンド**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **UI コンポーネント**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **バックエンド / データベース**: [Supabase](https://supabase.com/) (PostgreSQL)
- **インフラ**: Docker, Docker Compose

## 始め方

### 前提条件

- Docker & Docker Compose
- Node.js (Docker外でのローカル開発用)

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/kira612/Fweb.git
   cd Fweb
   ```

2. **環境設定**
   環境変数の例ファイルをコピーし、Supabase の認証情報を入力してください。
   ```bash
   cp .env.local.example .env.local
   ```
   *注意: Supabase プロジェクトの URL と Anon Key が必要です。*

3. **データベースのセットアップ**
   Supabase の SQL エディタで `schema.sql` のコマンドを実行し、必要なテーブルとポリシーを作成してください。

4. **Docker で実行**
   ```bash
   docker-compose up --build
   ```
   アプリケーションは `http://localhost:3000` で利用可能になります。

## ディレクトリ構成

- `app/`: Next.js App Router のページとレイアウト
- `components/`: 再利用可能な UI コンポーネント
- `utils/`: ユーティリティ関数 (Supabase クライアントなど)
- `public/`: 静的アセット
- `schema.sql`: データベーススキーマ定義

## ライセンス

このプロジェクトは教育目的で作成されています。
