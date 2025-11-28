'use client'

import { createPost } from '@/app/actions/createPost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useRef } from 'react'

export default function TalkPostForm() {
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
        <form action={createPost} ref={formRef} className="space-y-8">
            <input type="hidden" name="tags" value={tags.join(',')} />
            <input type="hidden" name="type" value="Talk" />

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="何について話しますか？"
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
                    className="font-mono text-sm"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <Button type="submit" size="lg">
                    投稿する
                </Button>
            </div>
        </form>
    )
}
