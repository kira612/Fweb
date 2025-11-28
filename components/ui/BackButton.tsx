'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
    className?: string
}

export default function BackButton({ className }: BackButtonProps) {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${className}`}
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-4 w-4" />
            戻る
        </Button>
    )
}
