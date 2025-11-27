import { createClient } from "@/utils/supabase/server";

export async function getPostLikeStatus(postId: string, userId?: string) {
    if (!userId) return false;

    const supabase = createClient();
    const { data } = await supabase
        .from("post_likes")
        .select("user_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

    return !!data;
}
