'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import UserAvatar from '@/components/UserAvatar'

export default function RegisterForm() {
    const [mode, setMode] = useState<'register' | 'login'>('login')
    const [displayName, setDisplayName] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('username', displayName)

            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                window.location.href = '/'
            } else {
                const data = await response.json()
                setError(data.error || 'ログインに失敗しました')
            }
        } catch (error) {
            setError('ログインに失敗しました')
        }

        setLoading(false)
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                window.location.href = '/'
            } else {
                const data = await response.json()
                setError(data.error || '登録に失敗しました')
            }
        } catch (error) {
            setError('登録に失敗しました')
        }

        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="font-bold text-lg">
                        {mode === 'register' ? 'アカウント登録' : 'ログイン'}
                    </div>
                </div>
            </header>

            <div className="container py-8 max-w-md mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold mb-2">Welcome to Campus Connect</h1>
                    <p className="text-muted-foreground">
                        {mode === 'register' ? 'プロフィールを設定してください' : 'ユーザー名を入力してログイン'}
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6 border rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 rounded-md transition-colors ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}
                    >
                        ログイン
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        className={`flex-1 py-2 rounded-md transition-colors ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}
                    >
                        新規登録
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                        {error}
                    </div>
                )}

                {mode === 'login' ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="login-username">ユーザー名</Label>
                            <Input
                                id="login-username"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="登録したユーザー名を入力"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'ログイン中...' : 'ログイン'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center space-y-4">
                            <UserAvatar
                                avatarUrl={previewUrl}
                                displayName={displayName}
                                size="lg"
                            />
                            <div className="w-full">
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
                                        <Upload className="h-5 w-5" />
                                        <span className="text-sm">画像を選択（任意）</span>
                                    </div>
                                    <Input
                                        id="avatar-upload"
                                        name="avatar_image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </Label>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label htmlFor="display_name">ユーザー名 *</Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="あなたの名前を入力"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                このユーザー名でログインします
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? '登録中...' : '登録する'}
                        </Button>
                    </form>
                )}
            </div>
        </main>
    )
}
