'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePost(postId: string, content: string) {
    console.log('[updatePost] Starting update for post:', postId)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    if (!userId) {
        return { error: 'User not authenticated.' }
    }

    // Check ownership
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single()

    if (fetchError || !post) {
        return { error: 'Post not found.' }
    }

    if (post.user_id !== userId) {
        return { error: 'Unauthorized.' }
    }

    // Update post
    const { error: updateError } = await supabase
        .from('posts')
        .update({
            content,
            updated_at: new Date().toISOString()
        })
        .eq('id', postId)

    if (updateError) {
        console.error('Error updating post:', updateError)
        return { error: 'Failed to update post: ' + updateError.message }
    }

    console.log('[updatePost] Post updated successfully')
    revalidatePath(`/posts/${postId}`)
    revalidatePath('/')
    return { success: true }
}
