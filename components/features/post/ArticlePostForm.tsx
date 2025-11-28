'use client'

import { createPost } from '@/app/actions/createPost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Bold, Heading3, Table, Code, Superscript, Eye, Edit } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import MarkdownViewer from '@/components/ui/MarkdownViewer'

export default function ArticlePostForm() {
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [content, setContent] = useState('')
    const [showPreview, setShowPreview] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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

    // Toolbar functions to insert Markdown
    const insertMarkdown = (before: string, after: string = '', defaultText: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end) || defaultText
        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

        setContent(newText)

        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.focus()
            const newPos = start + before.length + selectedText.length
            textarea.setSelectionRange(newPos, newPos)
        }, 0)
    }

    const insertBold = () => insertMarkdown('**', '**', '太字テキスト')
    const insertHeading = () => insertMarkdown('### ', '', '見出し')
    const insertTable = () => {
        const tableTemplate = `\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| データ | データ | データ |\n| データ | データ | データ |\n`
        insertMarkdown(tableTemplate, '')
    }
    const insertCodeBlock = () => insertMarkdown('```\n', '\n```', 'コードをここに入力')
    const insertMath = () => insertMarkdown('$$\n', '\n$$', 'E = mc^2')

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

            {/* Content with Markdown Toolbar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="content">本文 (Markdown & 数式対応)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? <Edit className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showPreview ? '編集' : 'プレビュー'}
                    </Button>
                </div>

                {/* Toolbar */}
                {!showPreview && (
                    <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/30">
                        <Button type="button" variant="ghost" size="sm" onClick={insertBold} title="太字">
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={insertHeading} title="見出し">
                            <Heading3 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={insertTable} title="表">
                            <Table className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={insertCodeBlock} title="コードブロック">
                            <Code className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={insertMath} title="数式">
                            <Superscript className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Editor or Preview */}
                {showPreview ? (
                    <>
                        <div className="min-h-[400px] p-4 border rounded-md bg-background">
                            <MarkdownViewer content={content} />
                        </div>
                        {/* Hidden textarea to maintain form submission */}
                        <Textarea
                            ref={textareaRef}
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="hidden"
                        />
                    </>
                ) : (
                    <Textarea
                        ref={textareaRef}
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="記事の内容を書いてください...&#10;&#10;**太字**&#10;### 見出し&#10;- リスト&#10;```code```&#10;$$ E = mc^2 $$"
                        required
                        rows={15}
                        className="font-mono text-sm"
                    />
                )}
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
