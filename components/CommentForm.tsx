'use client'

import { useRef, useState } from 'react'
import { addComment } from '@/app/actions/addComment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import LoginAlertModal from './features/LoginAlertModal'

export default function CommentForm({ postId, currentUserId }: { postId: string, currentUserId?: string }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleInteraction = (e: React.MouseEvent | React.FocusEvent) => {
        if (!currentUserId) {
            e.preventDefault()
            setShowLoginModal(true)
            // Blur the input if it was focused
            if (e.target instanceof HTMLElement) {
                e.target.blur()
            }
        }
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
                <div className="container max-w-2xl mx-auto">
                    <form
                        action={async (formData) => {
                            if (!currentUserId) return;
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
                            onFocus={handleInteraction}
                            onClick={handleInteraction}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault()
                                    if (!currentUserId) {
                                        setShowLoginModal(true)
                                        return
                                    }
                                    formRef.current?.requestSubmit()
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            onClick={handleInteraction}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
            <LoginAlertModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    )
}
