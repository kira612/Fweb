import { createClient } from '@/utils/supabase/server'

export async function getPopularTags() {
    const supabase = createClient()

    // Get all tags with their post counts
    const { data: tags, error } = await supabase
        .from('tags')
        .select('id, name, post_tags(count)')

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    if (!tags) return []

    // Transform data to include count
    const tagsWithCount = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        count: tag.post_tags?.[0]?.count || 0
    }))

    // Sort by count descending and return top 10
    return tagsWithCount
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
}
