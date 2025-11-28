import { createClient } from "@/utils/supabase/server";
import { Post } from "@/types";

export async function getPosts() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            users!user_id (
                display_name,
                avatar_url
            ),
            post_tags!post_id (
                tags (
                    name
                )
            ),
            comments (count)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    return data.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        ui_type: post.ui_type,
        image_url: post.image_url,
        created_at: post.created_at,
        user: {
            id: post.user_id,
            display_name: post.users?.display_name || "Unknown",
            avatar_url: post.users?.avatar_url,
        },
        tags: post.post_tags?.map((pt: any) => ({
            id: pt.tags?.id, // Note: id might be missing in select, need to check query
            name: pt.tags?.name,
        })) || [],
        likes_count: 0, // TODO: Implement likes count
        comments_count: post.comments?.[0]?.count || 0,
    })) as Post[];
}

export async function getPostById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            users!user_id (
                display_name,
                avatar_url
            ),
            post_tags!post_id (
                tags (
                    name
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching post:", error);
        return null;
    }

    const post = data as any;
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        ui_type: post.ui_type,
        image_url: post.image_url,
        created_at: post.created_at,
        user: {
            id: post.user_id,
            display_name: post.users?.display_name || "Unknown",
            avatar_url: post.users?.avatar_url,
        },
        tags: post.post_tags?.map((pt: any) => ({
            id: pt.tags?.id,
            name: pt.tags?.name,
        })) || [],
        likes_count: 0, // TODO: Implement likes count
        comments_count: 0, // Single post view usually fetches comments separately
    } as Post;
}
