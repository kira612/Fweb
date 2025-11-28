'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            router.refresh()
            router.refresh()
            router.push('/profile')
        } catch (err: any) {
            setError(err.message || 'ログインに失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })

            if (error) {
                throw error
            }

            setError('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。')
        } catch (err: any) {
            setError(err.message || '登録に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Campus Connect</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        ログインまたは新規登録してください
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@university.edu"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <Alert variant={error.includes('送信しました') ? 'default' : 'destructive'}>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            ログイン
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    または
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => supabase.auth.signInWithOAuth({
                                    provider: 'github',
                                    options: {
                                        redirectTo: `${location.origin}/auth/callback`,
                                    },
                                })}
                                disabled={isLoading}
                            >
                                GitHub
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${location.origin}/auth/callback`,
                                    },
                                })}
                                disabled={isLoading}
                            >
                                Google
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    アカウントをお持ちでない場合
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            disabled={isLoading}
                            onClick={handleSignUp}
                        >
                            新規登録 (Sign Up)
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link href="/" className="text-sm text-muted-foreground hover:underline">
                        トップページに戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}
