import { createClient } from '@/utils/supabase/server'
import { Post } from '@/types'

export async function getFavoritePosts(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post_likes')
        .select(`
            post_id,
            created_at,
            posts!inner(
                id,
                title,
                content,
                ui_type,
                image_url,
                created_at,
                users:users!posts_user_id_fkey(id, display_name, avatar_url),
                post_tags(tags(id, name))
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching favorite posts:', error)
        return []
    }

    // Transform the data to match Post type
    return data.map(item => {
        const post = item.posts as any;
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            ui_type: post.ui_type,
            image_url: post.image_url,
            created_at: post.created_at,
            user: {
                id: post.users?.id,
                display_name: post.users?.display_name || "Unknown",
                avatar_url: post.users?.avatar_url,
            },
            tags: post.post_tags?.map((pt: any) => ({
                id: pt.tags?.id,
                name: pt.tags?.name,
            })) || [],
            likes_count: 0, // TODO: Implement likes count
            comments_count: 0, // Favorites list usually doesn't show comment count or fetches separately
        };
    }) as Post[];
}
