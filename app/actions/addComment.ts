'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addComment(formData: FormData) {
    const supabase = createClient()
    const cookieStore = cookies()

    const postId = formData.get('post_id') as string
    const content = formData.get('content') as string
    const userId = cookieStore.get('user_id')?.value

    if (!postId || !content) {
        return { error: 'Content is required.' }
    }

    if (!userId) {
        return { error: 'User not authenticated.' }
    }

    const { error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: userId,
            content: content,
        })

    if (error) {
        console.error('Error adding comment:', error)
        return { error: 'Failed to add comment.' }
    }

    revalidatePath(`/posts/${postId}`)
    return { success: true }
}
