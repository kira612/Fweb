'use client'

import { useState } from 'react'
import { toggleLike } from '@/app/actions/toggleLike'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import clsx from 'clsx'

type LikeButtonProps = {
    postId: string
    initialIsLiked: boolean
    initialCount: number
    userId?: string | null  // Add userId to check login status
}

export default function LikeButton({ postId, initialIsLiked, initialCount, userId }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [count, setCount] = useState(initialCount)

    const handleToggle = async () => {
        // Login guard
        if (!userId) {
            alert('この機能を使うにはログインが必要です。')
            return
        }

        // Optimistic update
        const newIsLiked = !isLiked
        setIsLiked(newIsLiked)
        setCount(prev => newIsLiked ? prev + 1 : prev - 1)

        await toggleLike(postId)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={clsx(
                "gap-1 transition-colors",
                isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-muted-foreground hover:text-red-500"
            )}
        >
            <Heart className={clsx("h-5 w-5", isLiked && "fill-current")} />
            <span>{count}</span>
        </Button>
    )
}
