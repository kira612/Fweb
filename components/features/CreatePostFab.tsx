'use client'

import { PenLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import LoginAlertModal from './LoginAlertModal'

interface CreatePostFabProps {
    isLoggedIn: boolean
}

export default function CreatePostFab({ isLoggedIn }: CreatePostFabProps) {
    const router = useRouter()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoggedIn) {
            router.push('/posts/new')
        } else {
            setIsLoginModalOpen(true)
        }
    }

    return (
        <>
            <motion.button
                onClick={handleClick}
                className="fixed bottom-6 right-6 bg-gradient-main text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl z-50"
                aria-label="新規投稿"
                whileHover={{
                    y: [0, -4, 0],
                    scaleY: [1, 1.1, 0.95, 1],
                    transition: {
                        duration: 0.4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                    }
                }}
                whileTap={{ scale: 0.9 }}
            >
                <PenLine className="h-6 w-6" />
            </motion.button>
            <LoginAlertModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    )
}
