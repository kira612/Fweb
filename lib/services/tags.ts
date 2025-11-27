import { createClient } from "@/utils/supabase/server";

export async function getPopularTags() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("tags")
        .select(`
            name,
            post_tags (count)
        `);

    if (error) {
        console.error("Error fetching tags:", error);
        return [];
    }

    return data
        ?.map((tag: any) => ({
            name: tag.name,
            count: tag.post_tags?.[0]?.count || 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map((t) => t.name) || [];
}
