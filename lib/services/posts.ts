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

    return data as unknown as Post[];
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

    return data as unknown as Post;
}
