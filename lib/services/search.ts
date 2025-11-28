import { createClient } from "@/utils/supabase/server";
import { Post } from "@/types";

export async function searchPostsByKeyword(keyword: string) {
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
        .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error searching posts:", error);
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
            id: pt.tags?.id,
            name: pt.tags?.name,
        })) || [],
        likes_count: 0,
        comments_count: post.comments?.[0]?.count || 0,
    })) as Post[];
}

export async function searchPostsByTag(tagName: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            users!user_id (
                display_name,
                avatar_url
            ),
            post_tags!post_id!inner (
                tags!inner (
                    name
                )
            ),
            comments (count)
        `)
        .eq("post_tags.tags.name", tagName)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error searching posts by tag:", error);
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
            id: pt.tags?.id,
            name: pt.tags?.name,
        })) || [],
        likes_count: 0,
        comments_count: post.comments?.[0]?.count || 0,
    })) as Post[];
}
