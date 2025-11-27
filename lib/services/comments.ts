import { createClient } from "@/utils/supabase/server";
import { Comment } from "@/types";

export async function getCommentsByPostId(postId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("comments")
        .select(`
            *,
            users (
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

    return data as unknown as Comment[];
}
