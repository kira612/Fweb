'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deletePost(postId: string) {
    console.log('[deletePost] Starting deletion for post:', postId)
    const supabase = createClient()
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    console.log('[deletePost] Current user ID:', userId)

    if (!userId) {
        console.log('[deletePost] No user ID found')
        return { error: 'User not authenticated.' }
    }

    // Check ownership
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single()

    console.log('[deletePost] Post fetch result:', { post, error: fetchError })

    if (fetchError || !post) {
        console.log('[deletePost] Post not found')
        return { error: 'Post not found.' }
    }

    if (post.user_id !== userId) {
        console.log('[deletePost] User ID mismatch:', { post_user_id: post.user_id, current_user_id: userId })
        return { error: 'Unauthorized.' }
    }

    // Delete post
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

    console.log('[deletePost] Delete result:', { error: deleteError })

    if (deleteError) {
        console.error('Error deleting post:', deleteError)
        return { error: 'Failed to delete post: ' + deleteError.message }
    }

    console.log('[deletePost] Post deleted successfully, revalidating and redirecting')
    revalidatePath('/')
    redirect('/')
}
