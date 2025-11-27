'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deletePost(postId: string) {
    const supabase = createClient()
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

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

    // Delete post
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

    if (deleteError) {
        console.error('Error deleting post:', deleteError)
        return { error: 'Failed to delete post.' }
    }

    redirect('/')
}
