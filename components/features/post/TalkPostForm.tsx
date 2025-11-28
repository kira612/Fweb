'use client'

import { createPost } from '@/app/actions/createPost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import SpringButton from '@/components/ui/SpringButton'

export default function TalkPostForm() {
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createPost(formData)

            if (result && 'success' in result && !result.success) {
                setErrorMessage(result.error || '投稿に失敗しました。')
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error('Submit error:', error)
            setErrorMessage('予期しないエラーが発生しました。')
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-8">
            <input type="hidden" name="tags" value={tags.join(',')} />
            <input type="hidden" name="type" value="Talk" />

            {/* Error Message */}
            {errorMessage && (
                <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="話したいことのタイトルを入力"
                    required
                    disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    placeholder="例: 雑談 質問"
                />
            </div>

            {/* Content - Optional */}
            <div className="space-y-2">
                <Label htmlFor="content">補足（任意）</Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="補足があれば入力してください..."
                    rows={8}
                    disabled={isSubmitting}
                    className="font-mono text-sm"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <SpringButton asChild>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                送信中...
                            </>
                        ) : (
                            '投稿する'
                        )}
                    </Button>
                </SpringButton>
            </div>
        </form>
    )
}
