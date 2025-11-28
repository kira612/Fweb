'use client'

import { deletePost } from '@/app/actions/deletePost'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import SpringButton from '@/components/ui/SpringButton'

export default function DeleteButton({ postId }: { postId: string }) {
    const handleDelete = async () => {
        if (confirm('本当にこの記事を削除しますか？\nこの操作は取り消せません。')) {
            const result = await deletePost(postId)
            if (result?.error) {
                alert('削除に失敗しました: ' + result.error)
            }
        }
    }

    return (
        <SpringButton asChild>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
            >
                <Trash2 className="h-4 w-4" />
                削除
            </Button>
        </SpringButton>
    )
}
