'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Loader2 } from 'lucide-react'
import { updatePost } from '@/app/actions/updatePost'
import { useRouter } from 'next/navigation'

interface EditArticleButtonProps {
    postId: string
    initialContent: string
}

export default function EditArticleButton({ postId, initialContent }: EditArticleButtonProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState(initialContent)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleUpdate = async () => {
        setIsSubmitting(true)
        try {
            const result = await updatePost(postId, content)
            if (result.error) {
                alert('更新に失敗しました: ' + result.error)
            } else {
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to update post:', error)
            alert('更新に失敗しました。')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                    <Pencil className="h-4 w-4" />
                    編集
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>記事を編集</DialogTitle>
                    <DialogDescription>
                        記事の本文を編集できます。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="font-mono text-sm"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        キャンセル
                    </Button>
                    <Button onClick={handleUpdate} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        保存する
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
