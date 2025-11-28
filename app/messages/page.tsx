import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { MessageCircle } from 'lucide-react'

export const revalidate = 0

export default async function MessagesPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Redirect if not logged in
    if (!user) {
        redirect('/login')
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="container py-6 max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">メッセージ</h1>
                    </div>
                </div>

                <div className="text-center py-16">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                        メッセージ機能は準備中です
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        ユーザー同士で直接やり取りできる機能を追加予定です
                    </p>
                </div>
            </div>
        </main>
    )
}
