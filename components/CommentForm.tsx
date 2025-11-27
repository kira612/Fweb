'use client'

import { useRef } from 'react'
import { addComment } from '@/app/actions/addComment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

export default function CommentForm({ postId }: { postId: string }) {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="container max-w-2xl mx-auto">
                <form
                    action={async (formData) => {
                        await addComment(formData)
                        formRef.current?.reset()
                    }}
                    ref={formRef}
                    className="flex gap-2"
                >
                    <input type="hidden" name="post_id" value={postId} />
                    <Input
                        name="content"
                        placeholder="コメントを入力..."
                        className="flex-1"
                        autoComplete="off"
                        required
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
