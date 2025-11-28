'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
    const supabase = createClient()
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
        return { error: 'User not authenticated.' }
    }

    // Check if like exists
    const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

    if (existingLike) {
        // Delete like
        const { error: deleteError } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId)

        if (deleteError) {
            console.error('Error removing like:', deleteError)
            return { error: 'Failed to remove like.' }
        }
    } else {
        // Insert like
        const { error: insertError } = await supabase
            .from('post_likes')
            .insert({
                post_id: postId,
                user_id: userId,
            })

        if (insertError) {
            console.error('Error adding like:', insertError)
            return { error: 'Failed to add like.' }
        }
    }

    revalidatePath(`/posts/${postId}`)
    revalidatePath('/') // Update home page counts too
    revalidatePath('/favorites') // Update favorites page
    return { success: true }
}
