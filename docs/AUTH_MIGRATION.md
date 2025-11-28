# 認証システム移行ガイド - Supabase Authへの移行

## 概要

Campus Connectは現在、シンプルなユーザー名ベースの認証システムを使用していますが、将来的にSupabase Authを使用したメール/パスワード認証に移行できるように設計されています。

このドキュメントでは、移行の手順を詳しく説明します。

---

## 現在の認証システム（オプション1）

### 仕組み
- ユーザーは**ユーザー名のみ**で登録・ログイン
- セッション管理はCookieに`user_id`を保存
- セキュリティは低いが、実装が簡単

### 主要ファイル
- `lib/auth/auth.ts` - 認証ロジックの抽象化レイヤー
- `app/api/login/route.ts` - ログインAPIエンドポイント
- `app/api/register/route.ts` - 登録APIエンドポイント
- `components/RegisterForm.tsx` - ログイン/登録UI

---

## 移行先の認証システム（オプション2）

### Supabase Authとは
- Supabaseが提供する本格的な認証サービス
- メール/パスワード、OAuth、マジックリンクなどに対応
- セキュアで、セッション管理も自動

### メリット
- ✅ セキュリティが大幅に向上
- ✅ パスワードリセット機能が標準搭載
- ✅ メール確認機能
- ✅ OAuth（Google、GitHubなど）対応可能
- ✅ セッション管理が自動化

---

## 移行手順

### ステップ1: Supabase Authの有効化

1. **Supabaseダッシュボードにアクセス**
   - プロジェクトの「Authentication」セクションに移動

2. **メール認証を有効化**
   - Settings → Email Auth を有効にする
   - メールテンプレートをカスタマイズ（オプション）

3. **OAuth設定（オプション）**
   - Google、GitHubなどのプロバイダーを設定
   - リダイレクトURLを設定: `http://localhost:3000/auth/callback`

### ステップ2: データベーススキーマの更新

現在の`users`テーブルを更新して、Supabase Authと連携できるようにします。

```sql
-- users テーブルに email カラムを追加
ALTER TABLE public.users ADD COLUMN email TEXT UNIQUE;

-- auth.users と連携するための user_id カラムを追加（既存の id とは別）
ALTER TABLE public.users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- インデックスを作成
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_users_email ON public.users(email);
```

### ステップ3: 認証ロジックの更新

`lib/auth/auth.ts` を更新します。

#### 3-1. コメントアウトされている関数を有効化

ファイル末尾のコメントアウトされている以下の関数を有効化：
- `loginWithEmail(email, password)`
- `registerWithEmail(email, password, displayName)`

#### 3-2. 既存関数の非推奨化

古い関数にコメントを追加：

```typescript
/**
 * @deprecated Use loginWithEmail instead
 */
export async function loginWithUsername(username: string) {
    // ... 既存のコード
}
```

### ステップ4: UIの更新

`components/RegisterForm.tsx` を更新します。

#### 変更点
1. **ユーザー名入力 → メール入力に変更**
   ```tsx
   // 変更前
   <Input placeholder="ユーザー名を入力" />
   
   // 変更後
   <Input type="email" placeholder="メールアドレスを入力" />
   ```

2. **パスワード入力欄を追加**
   ```tsx
   <Input type="password" placeholder="パスワードを入力" required />
   ```

3. **登録フォームにメール確認欄を追加（オプション）**
   ```tsx
   <Input type="password" placeholder="パスワードを再入力" required />
   ```

### ステップ5: APIエンドポイントの更新

#### `app/api/login/route.ts`
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ success: true })
}
```

#### `app/api/register/route.ts`
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('display_name') as string

    const supabase = createClient()
    
    // Supabase Authでユーザー登録
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName }
        }
    })

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // public.users テーブルにも登録
    const { error: dbError } = await supabase
        .from('users')
        .insert({
            auth_user_id: authData.user?.id,
            display_name: displayName,
            email: email,
            is_guest: false,
        })

    if (dbError) {
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
```

### ステップ6: セッション管理の更新

#### `app/page.tsx` などでの現在のユーザー取得

```typescript
// 変更前
const cookieStore = cookies()
const userId = cookieStore.get('user_id')?.value

// 変更後
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

if (user) {
    // auth_user_id で users テーブルからプロフィールを取得
    const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()
}
```

### ステップ7: ログアウト機能の実装

#### `app/api/logout/route.ts` を作成

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = createClient()
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
}
```

#### ヘッダーにログアウトボタンを追加

プロフィールページまたはヘッダーにログアウトボタンを追加します。

### ステップ8: 認証コールバックの設定

#### `app/auth/callback/route.ts` を作成

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(new URL('/', request.url))
}
```

---

## 移行のテスト

### テストチェックリスト

- [ ] メールアドレスで新規登録できる
- [ ] 登録確認メールが届く（メール確認を有効にしている場合）
- [ ] メールアドレスとパスワードでログインできる
- [ ] ログアウトできる
- [ ] セッションが維持される（ページをリロードしてもログイン状態が保持される）
- [ ] 投稿の作成・編集・削除ができる
- [ ] プロフィール編集ができる
- [ ] パスワードリセットが機能する（実装した場合）

---

## トラブルシューティング

### よくある問題

#### 1. 「User not found」エラー
- `users`テーブルと`auth.users`の同期を確認
- `auth_user_id`が正しく設定されているか確認

#### 2. セッションが維持されない
- Supabase クライアントの初期化を確認
- Cookieの設定を確認（`httpOnly`, `sameSite`）

#### 3. メールが届かない
- Supabaseダッシュボードで「Email Auth」が有効か確認
- スパムフォルダを確認
- Supabaseの無料プランではメール送信に制限がある場合があります

---

## 参考リンク

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Auth UI Components](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

---

## 段階的移行（両方のシステムを併用）

完全移行する前に、両方のシステムを併用することもできます：

1. 新規ユーザーはメール/パスワードで登録
2. 既存ユーザーは引き続きユーザー名でログイン可能
3. 既存ユーザーに「メールアドレスを登録してください」と促す
4. すべてのユーザーが移行したら、古いシステムを削除

この方法により、ユーザー体験を損なわずに移行できます。
