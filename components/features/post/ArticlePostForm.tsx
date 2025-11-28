'use client'

import { createPost } from '@/app/actions/createPost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function ArticlePostForm() {
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        const fileInput = document.getElementById('post_image') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <form action={createPost} ref={formRef} className="space-y-8">
            <input type="hidden" name="tags" value={tags.join(',')} />
            <input type="hidden" name="type" value="Article" />

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
                    placeholder="例: 楽単 プログラミング"
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label htmlFor="post_image">画像（任意）</Label>
                {imagePreview ? (
                    <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <Label htmlFor="post_image" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">クリックして画像を選択</span>
                        </div>
                    </Label>
                )}
                <Input
                    id="post_image"
                    name="post_image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>

            {/* Content */}
            <div className="space-y-2">
                <Label htmlFor="content">本文 (Markdown対応)</Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="記事の内容を書いてください..."
                    required
                    rows={15}
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
