import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import PostCard from '@/components/PostCard'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getFavoritePosts } from '@/lib/services/favorites'

export const revalidate = 0

export default async function FavoritesPage() {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    // Redirect if not logged in
    if (!userId) {
        redirect('/')
    }

    const supabase = createClient()

    // Get current user for header
    const { data: currentUser } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('id', userId)
        .single()

    const favoritePosts = await getFavoritePosts(userId);

    return (
        <main className="min-h-screen bg-background pb-20">

            <div className="container py-6 max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            戻る
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500 fill-current" />
                        <h1 className="text-2xl font-bold">お気に入り</h1>
                    </div>
                </div>

                {/* Posts List */}
                {!favoritePosts || favoritePosts.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                            お気に入りの記事はまだありません
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            気に入った記事にハートマークを押して、お気に入りに追加しましょう
                        </p>
                        <Link href="/">
                            <Button>記事を探す</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {favoritePosts.length}件の記事
                        </p>
                        {favoritePosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
