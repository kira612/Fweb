'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface LoginAlertModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function LoginAlertModal({ isOpen, onClose }: LoginAlertModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleLogin = () => {
        router.push('/login')
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                <h2 className="text-lg font-bold mb-2">ログインが必要です</h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    この機能を利用するにはログインが必要です。<br />
                    ログイン画面へ移動しますか？
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={handleLogin}>
                        ログイン
                    </Button>
                </div>
            </div>
        </div>
    )
}
