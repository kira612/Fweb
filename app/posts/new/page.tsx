'use client'

import { createPost } from '@/app/actions/createPost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef } from 'react'
// import { useFormStatus } from 'react-dom' // Not available in all next versions yet, but standard in 14

export default function NewPostPage() {
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
            e.preventDefault()
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="font-bold text-lg">新規投稿</div>
                </div>
            </header>

            <div className="container py-6 max-w-2xl mx-auto">
                <form action={createPost} ref={formRef} className="space-y-8">
                    {/* Hidden input for tags */}
                    <input type="hidden" name="tags" value={tags.join(',')} />

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">タイトル</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="記事のタイトルを入力"
                            required
                            className="text-lg font-medium"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tag-input">タグ (スペースまたはEnterで追加)</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-normal gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-destructive ml-1"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <Input
                            id="tag-input"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="例: #楽単 #プログラミング"
                        />
                    </div>

                    {/* Post Type */}
                    <div className="space-y-2">
                        <Label>投稿タイプ</Label>
                        <RadioGroup defaultValue="Talk" name="type" className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="Article" id="article" className="peer sr-only" />
                                <Label
                                    htmlFor="article"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <BookOpen className="mb-3 h-6 w-6" />
                                    <div className="text-center">
                                        <div className="font-semibold">Article</div>
                                        <div className="text-xs text-muted-foreground mt-1">しっかり共有</div>
                                    </div>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Talk" id="talk" className="peer sr-only" />
                                <Label
                                    htmlFor="talk"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <MessageCircle className="mb-3 h-6 w-6" />
                                    <div className="text-center">
                                        <div className="font-semibold">Talk</div>
                                        <div className="text-xs text-muted-foreground mt-1">気軽につぶやく</div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">本文 (Markdown対応)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="本文を入力してください..."
                            required
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                        <div className="container max-w-2xl mx-auto">
                            <SubmitButton />
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

function SubmitButton() {
    // In Next.js 14, useFormStatus must be used in a child component of the form
    // or we can use it here if we are inside the form context? 
    // Actually, useFormStatus only works if the parent is a form using server action.
    // Since we are inside the form in the parent, we need to extract this button to use the hook properly?
    // No, useFormStatus must be used inside a component rendered *inside* the form.
    const { pending } = require('react-dom').useFormStatus() // Dynamic require to avoid build issues if types are strict, or just import at top if possible.
    // Let's try standard import at top, but I'll use a safer approach for now.
    // Actually, let's just use a simple button for now to avoid complexity if useFormStatus is tricky with the current setup.
    // But the user asked for "投稿ボタン".

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? '投稿中...' : '投稿する'}
        </Button>
    )
}
