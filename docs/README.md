# Documentation

このフォルダには、Campus Connectの技術的なドキュメントが含まれています。

## ドキュメント一覧

### [AUTH_MIGRATION.md](./AUTH_MIGRATION.md)
現在のシンプルなユーザー名認証から、Supabase Authを使用したメール/パスワード認証への移行手順を詳しく説明しています。

**こんな時に読んでください：**
- より安全な認証システムに移行したい
- メール/パスワード認証を導入したい
- OAuth（Google、GitHubログインなど）を追加したい
- パスワードリセット機能が必要になった

---

## その他の参考資料

### アーキテクチャ概要
プロジェクトのアーキテクチャについては、プロジェクトルートの `architecture.md` を参照してください（もしあれば）。

### データベーススキーマ
現在のデータベーススキーマは `schema.sql` に定義されています。

### API仕様
- 投稿作成: `app/actions/createPost.ts`
- プロフィール更新: `app/api/profile/route.ts`
- ログイン: `app/api/login/route.ts`
- 登録: `app/api/register/route.ts`

---

## 将来追加予定のドキュメント

- [ ] デプロイ手順（Vercel、Docker）
- [ ] 開発環境のセットアップガイド
- [ ] テスト戦略
- [ ] パフォーマンス最適化ガイド
- [ ] セキュリティベストプラクティス
