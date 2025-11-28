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

    return data as unknown as Post[];
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

    return data as unknown as Post[];
}
