# Campus Connect

大学専用掲示板「Campus Connect」のプロジェクトリポジトリです。
学生同士が情報を共有し、交流するためのプラットフォームです。

## 必須要件

- **Docker**: コンテナ化されたアプリケーションの実行に必要です。
- **Git**: ソースコードの管理に必要です。

詳細な仕様や保守手順については、[docs/MAINTENANCE.md](docs/MAINTENANCE.md) を参照してください。

## 環境構築手順

以下の手順に従って、ローカル開発環境を立ち上げてください。

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd Fban
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env` ファイルを作成し、Supabaseの接続情報を設定します。

```bash
cp .env.local.example .env
```

`.env` ファイルを開き、以下の項目を入力してください。

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. アプリケーションの起動

Docker Composeを使用してアプリケーションを起動します。

```bash
docker-compose up --build
```

起動後、ブラウザで `https://fweb-one.vercel.app/` にアクセスしてください。

## データベースとストレージのセットアップ (最重要)

本プロジェクトは Supabase をバックエンドとして使用しています。以下の手順でデータベースとストレージをセットアップしてください。

### 1. データベースの構築 (SQL実行)

Supabaseの管理画面で **SQL Editor** を開き、以下もしくは指示のあるSQLスクリプトをすべてコピー＆ペーストして実行してください。
これにより、必要なテーブル、セキュリティポリシー(RLS)、トリガー、インデックスが作成されます。
```txt
schema.sql'
```
を参照してください。


### 2. Storage設定 (手動設定)

SQLではStorageバケットの作成ができないため、以下の手順で手動設定してください。

1.  Supabase管理画面の **Storage** に移動します。
2.  **Create new bucket** をクリックし、以下の2つのバケットを作成します。
    *   `avatars` (Public bucket: ON)
    *   `post_images` (Public bucket: ON)
    *   `message_images` (Public bucket: ON)
3.  各バケットの **Policies** 設定を開き、**New policy** を作成します。
    *   開発用として簡略化する場合は、"Give users access to all files" テンプレートなどを参考に、SELECT/INSERT/UPDATE/DELETE を許可する設定を行ってください（本番運用時は適切な制限を推奨）。

### 3. Auth設定 (手動設定)
---

### ⚙️ 重要：ご自身で行う設定（ダッシュボード）

social loginのための**SupabaseとGoogle/GitHubを繋ぐ「鍵」の設定**が必要です。

#### 1. SupabaseのリダイレクトURL設定
OAuthが終わった後に戻ってくる場所を許可リストに登録します。
1.  Supabase管理画面 > **Authentication** > **URL Configuration**
2.  **Redirect URLs** に以下を追加して保存：
    * `https://fweb-one.vercel.app/auth/callback`

#### 2. GitHubの設定 (GitHub Login)
1.  [GitHub Developer Settings](https://github.com/settings/developers) > **New OAuth App**
2.  **Homepage URL**: `https://fweb-one.vercel.app/`
3.  **Authorization callback URL**: `https://<あなたのPROJECT_ID>.supabase.co/auth/v1/callback`
    * ※Supabase管理画面の Auth > Providers > GitHub に表示されている「Callback URL」をコピペしてください。
4.  作成後、**Client ID** と **Client Secret** をコピー。
5.  Supabase管理画面 > Auth > Providers > **GitHub** を開き、IDとSecretを貼り付けて **Enabled** にする。

#### 3. Googleの設定 (Google Login)
1.  [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成。
2.  **APIs & Services** > **OAuth consent screen** を設定（Externalで作成）。
3.  **Credentials** > **Create Credentials** > **OAuth client ID** (Web application)。
4.  **Authorized redirect URIs**: `https://<あなたのPROJECT_ID>.supabase.co/auth/v1/callback`
    * ※これもSupabase管理画面に表示されているURLです。
5.  作成後、IDとSecretをコピーして、Supabase管理画面 > Auth > Providers > **Google** に貼り付けて **Enabled** にする。

---

設定が少し大変ですが、これを乗り越えれば「モダンなログイン画面」の完成です！頑張ってください！

## トラブルシューティング

### 画像が表示されない場合
`next.config.js` の `images.remotePatterns` に、使用しているSupabaseプロジェクトのホスト名が含まれているか確認してください。

```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project-id.supabase.co', // ここが正しいか確認
      },
    ],
  },
};
```

### ログイン状態がおかしい場合
ブラウザのCookieを削除するか、シークレットウィンドウで試してみてください。開発環境ではCookieの挙動が不安定になることがあります。

## 最新の変更点 (v1.1.0)

- **DM機能**: リアルタイムチャット、受信トレイ、未読通知バッジを実装しました。
- **ゲストユーザー体験**: コメントやいいね！などのアクション時に、ログイン誘導モーダルを表示するようにしました。
- **パフォーマンス**: データベースインデックスの追加と、データ取得処理の最適化を行いました。
- **サインアップフロー**: 登録後の自動ログインとリダイレクトを実装し、スムーズな利用開始を実現しました。
