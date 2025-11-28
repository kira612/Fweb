import { createClient } from "@/utils/supabase/server";
import { Comment } from "@/types";

export async function getCommentsByPostId(postId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("comments")
        .select(`
            *,
            users!user_id (
                display_name,
                avatar_url
            )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    return data.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
            id: comment.user_id,
            display_name: comment.users?.display_name || "Unknown",
            avatar_url: comment.users?.avatar_url,
        },
    })) as Comment[];
}
