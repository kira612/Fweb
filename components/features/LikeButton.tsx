'use client'

import { useState } from 'react'
import { toggleLike } from '@/app/actions/toggleLike'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import LoginAlertModal from './LoginAlertModal'
import { motion, AnimatePresence } from 'framer-motion'

type LikeButtonProps = {
    postId: string
    initialIsLiked: boolean
    initialCount: number
    userId?: string | null  // Add userId to check login status
}

interface FloatingHeart {
    id: number
    x: number
    delay: number
}

export default function LikeButton({ postId, initialIsLiked, initialCount, userId }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [count, setCount] = useState(initialCount)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation if inside a link
        e.stopPropagation()

        // Login guard
        if (!userId) {
            setShowLoginModal(true)
            return
        }

        // Optimistic update
        const newIsLiked = !isLiked
        setIsLiked(newIsLiked)
        setCount(prev => newIsLiked ? prev + 1 : prev - 1)

        // Trigger animation if liking
        if (newIsLiked) {
            const newHearts = Array.from({ length: 3 }).map((_, i) => ({
                id: Date.now() + i,
                x: (Math.random() - 0.5) * 40, // Random x offset between -20 and 20
                delay: i * 0.1 // Staggered delay
            }))
            setFloatingHearts(prev => [...prev, ...newHearts])
        }

        await toggleLike(postId)
    }

    return (
        <>
            <div className="relative inline-block">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className={clsx(
                        "gap-1 transition-colors z-10 relative",
                        isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-muted-foreground hover:text-red-500"
                    )}
                >
                    <Heart className={clsx("h-5 w-5", isLiked && "fill-current")} />
                    <span>{count}</span>
                </Button>

                {/* Floating Hearts Container */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                    <AnimatePresence>
                        {floatingHearts.map(heart => (
                            <motion.div
                                key={heart.id}
                                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                animate={{
                                    y: -100,
                                    x: heart.x,
                                    opacity: 0,
                                    scale: 1
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeOut",
                                    delay: heart.delay
                                }}
                                onAnimationComplete={() => {
                                    setFloatingHearts(prev => prev.filter(h => h.id !== heart.id))
                                }}
                                className="absolute top-0 text-red-500"
                            >
                                <Heart className="h-5 w-5 fill-current" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <LoginAlertModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    )
}
