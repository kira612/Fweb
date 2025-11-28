'use client'

import { PenLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoginAlertModal from './LoginAlertModal'
import SpringButton from '@/components/ui/SpringButton'

interface CreatePostFabProps {
    isLoggedIn: boolean
}

export default function CreatePostFab({ isLoggedIn }: CreatePostFabProps) {
    const router = useRouter()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleClick = () => {
        if (isLoggedIn) {
            router.push('/posts/new')
        } else {
            setIsLoginModalOpen(true)
        }
    }

    return (
        <>
            <SpringButton
                onClick={handleClick}
                className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all z-50"
                aria-label="新規投稿"
            >
                <PenLine className="h-6 w-6" />
            </SpringButton>
            <LoginAlertModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    )
}
