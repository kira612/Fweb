'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import UserAvatar from '@/components/UserAvatar'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
    initialData: {
        display_name: string | null
        avatar_url: string | null
    } | null
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [displayName, setDisplayName] = useState(initialData?.display_name || '')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                window.location.href = '/'
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="font-bold text-lg">マイプロファイル</div>
                </div>
            </header>

            <div className="container py-8 max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center space-y-4">
                        <UserAvatar
                            avatarUrl={previewUrl || initialData?.avatar_url}
                            displayName={displayName}
                            size="lg"
                        />
                        <div className="w-full">
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
                                    <Upload className="h-5 w-5" />
                                    <span className="text-sm">画像を選択</span>
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
                        <Label htmlFor="display_name">表示名</Label>
                        <Input
                            id="display_name"
                            name="display_name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="名前を入力"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full">
                        保存する
                    </Button>

                    <div className="pt-4 border-t">
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            onClick={handleLogout}
                        >
                            ログアウト
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}
