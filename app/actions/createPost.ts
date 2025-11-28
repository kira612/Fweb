'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
    const supabase = createClient()
    const cookieStore = cookies()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const type = formData.get('type') as string
    const tagsString = formData.get('tags') as string
    const postImage = formData.get('post_image') as File | null
    const tags = tagsString ? tagsString.split(',').filter(Boolean) : []

    // Validation: Title and type always required
    // Content required only for Article, optional for Talk
    if (!title || !type) {
        return { error: 'Title and type are required.' }
    }

    if (type === 'Article' && !content) {
        return { error: 'Content is required for Article posts.' }
    }

    // For Talk posts, use empty string if content is not provided
    const finalContent = content || ''

    // 1. User Handling
    let userId = cookieStore.get('user_id')?.value

    if (!userId) {
        const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
                display_name: '名無し学生',
                is_guest: true,
                avatar_url: '',
            })
            .select('id')
            .single()

        if (userError) {
            return { error: 'Failed to create user.' }
        }

        userId = newUser.id
        cookieStore.set('user_id', userId as string, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax'
        })
    }

    // 2. Upload Image (if provided)
    let imageUrl: string | null = null

    if (postImage && postImage.size > 0) {
        const fileExt = postImage.name.split('.').pop()
        const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('post_images')
            .upload(fileName, postImage, {
                cacheControl: '3600',
                upsert: false
            })

        if (!uploadError) {
            const { data: urlData } = supabase.storage
                .from('post_images')
                .getPublicUrl(fileName)

            imageUrl = urlData.publicUrl
        }
    }

    // 3. Create Post
    const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            title,
            content: finalContent,
            ui_type: type,
            image_url: imageUrl,
        })
        .select('id')
        .single()

    if (postError) {
        return { error: 'Failed to create post. ' + postError.message }
    }

    // 4. Handle Tags
    if (tags.length > 0) {
        for (const tagName of tags) {
            let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', tagName)
                .single()

            if (!tag) {
                const { data: newTag } = await supabase
                    .from('tags')
                    .insert({ name: tagName })
                    .select('id')
                    .single()

                tag = newTag
            }

            if (tag) {
                await supabase
                    .from('post_tags')
                    .insert({
                        post_id: post.id,
                        tag_id: tag.id,
                    })
            }
        }
    }

    redirect(`/posts/${post.id}`)
}
