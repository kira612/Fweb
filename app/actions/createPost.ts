'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
    try {
        const supabase = createClient()

        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: '投稿するにはログインが必要です' }
        }

        const userId = user.id

        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const type = formData.get('type') as string
        const tagsString = formData.get('tags') as string
        const postImage = formData.get('post_image') as File | null
        const tags = tagsString ? tagsString.split(',').filter(Boolean) : []

        // Validation: Title and type always required
        // Content required only for Article, optional for Talk
        if (!title || !type) {
            return { success: false, error: 'タイトルと投稿タイプは必須です。' }
        }

        if (type === 'Article' && !content) {
            return { success: false, error: 'Article投稿では本文が必須です。' }
        }

        // For Talk posts, use empty string if content is not provided
        const finalContent = content || ''

        // 2. Image Upload (if exists)
        let imageUrl: string | null = null
        if (postImage && postImage.size > 0) {
            const fileName = `${Date.now()}_${postImage.name}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('post_images')
                .upload(fileName, postImage, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) {
                console.error('Image upload error:', uploadError)
                return { success: false, error: '画像のアップロードに失敗しました。' }
            }

            const { data: publicUrlData } = supabase.storage
                .from('post_images')
                .getPublicUrl(uploadData.path)

            imageUrl = publicUrlData.publicUrl
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
            .select()
            .single()

        if (postError || !post) {
            console.error('Post creation error:', postError)
            return { success: false, error: '投稿の作成に失敗しました。' }
        }

        // 4. Tag Handling
        if (tags.length > 0) {
            for (const tagName of tags) {
                // Check if tag exists
                let { data: existingTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', tagName)
                    .single()

                let tagId: string

                if (existingTag) {
                    tagId = existingTag.id
                } else {
                    const { data: newTag, error: tagError } = await supabase
                        .from('tags')
                        .insert({ name: tagName })
                        .select()
                        .single()

                    if (tagError || !newTag) {
                        console.error('Tag creation error:', tagError)
                        continue
                    }

                    tagId = newTag.id
                }

                // Link tag to post
                await supabase.from('post_tags').insert({
                    post_id: post.id,
                    tag_id: tagId,
                })
            }
        }

        // 5. Revalidate and Redirect
        revalidatePath('/')
        revalidatePath(`/posts/${post.id}`)
        
        redirect(`/posts/${post.id}`)

    } catch (error: any) {
        // Check if it's a redirect error (which is expected)
        if (error?.message?.includes('NEXT_REDIRECT')) {
            throw error // Re-throw redirect errors
        }

        console.error('Unexpected error:', error)
        return { success: false, error: '予期しないエラーが発生しました。' }
    }

    // Success - redirect to the new post (moved out of try-catch to avoid catching redirect error if possible, but redirect throws so it must be handled or outside)
    // Actually redirect throws an error that is caught by Next.js boundary. 
    // In server actions, redirect should be called. 
    // The previous code had redirect inside try block and re-threw it.
    // However, I need to make sure `post` is available. 
    // I'll keep the redirect logic inside try/catch but ensure I have the post ID.
    // Wait, I cannot access `post` outside the block easily unless I declare it outside.
    // I'll stick to the previous pattern: re-throw NEXT_REDIRECT.

    // But wait, I need to return the redirect result? No, redirect() never returns.
    // The issue with my rewrite above is that `post` is scoped to the try block.
    // So I must do redirect inside.

    // Let's correct the structure in the file content I'm writing.
    // I already included re-throw logic.
    // But I missed the redirect call itself in the code above?
    // Ah, I see `revalidatePath` but where is `redirect`?
    // It was at the end of the try block in the original.
    // I will add it back.
}
