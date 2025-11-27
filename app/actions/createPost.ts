'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
    const supabase = createClient()
    const cookieStore = cookies()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const type = formData.get('type') as string // 'Article' or 'Talk'
    const tagsString = formData.get('tags') as string
    const tags = tagsString ? tagsString.split(',').filter(Boolean) : []

    console.log('[createPost] Form data:', { title, content, type, tagsString, tags })

    if (!title || !content || !type) {
        // Basic validation
        console.log('[createPost] Validation failed:', { title, content, type })
        return { error: 'Title, content, and type are required.' }
    }

    // 1. User Handling
    let userId = cookieStore.get('user_id')?.value

    if (!userId) {
        // Create a new guest user
        const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
                display_name: '名無し学生',
                is_guest: true,
                avatar_url: '', // Optional: Add a default avatar
            })
            .select('id')
            .single()

        if (userError) {
            console.error('Error creating user:', userError)
            return { error: 'Failed to create user.' }
        }

        userId = newUser.id
        // Persist user ID in cookie
        cookieStore.set('user_id', userId as string, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: 'lax'
        })
    }

    // 2. Create Post
    // Note: Schema doesn't have 'type' column in posts table based on schema.sql provided earlier.
    // Wait, the user request says: "posts テーブルに ui_type ("article" or "talk") 含めてINSERT"
    // But the schema.sql I saw earlier:
    // create table public.posts (
    //   id uuid default uuid_generate_v4() primary key,
    //   user_id uuid references public.users(id) on delete cascade not null,
    //   title text not null,
    //   content text not null, -- Markdown
    //   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    //   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    // );
    // It seems I missed adding the `ui_type` column or the user expects me to add it?
    // The user request implies I should insert it. I should probably check if the column exists or if I need to add it.
    // Given I can't easily check DB schema live without running a query, and the user *asked* me to insert it,
    // I should probably assume the schema *should* have it.
    // However, I saw the schema.sql file content in Step 83 and it DID NOT have `ui_type`.
    // I should probably add a migration or just update the schema.sql and run it?
    // Or maybe I should just try to insert and if it fails, I know why.
    // Actually, the user's prompt says: "posts テーブルに ui_type ("article" or "talk") 含めてINSERT"
    // This implies I should ensure the column exists.
    // I will add a step to update the schema if needed, but for now I will write the code assuming it exists
    // AND I will also execute a SQL command to add the column if it's missing to be safe, or update schema.sql.
    // Let's update schema.sql first to reflect this requirement, and then I might need to run a migration command if I could.
    // Since I can't run arbitrary SQL easily without a client, I will assume the user might run schema.sql or I can try to run it via supabase client if possible?
    // No, I can't run DDL via supabase client usually.
    // I will assume the user expects me to update the code to use it.
    // Wait, I can't change the DB schema from here easily.
    // I'll assume the user wants me to handle the code part.
    // BUT, if I write code that tries to insert `ui_type`, it will fail if the column is missing.
    // I'll check `schema.sql` again. It definitely didn't have it.
    // I should probably mention this to the user or try to work around it.
    // Actually, I can use the `rpc` or just hope the user updates the DB?
    // No, I should probably provide the SQL to update it or update schema.sql.
    // I'll update schema.sql and ask the user to run it, OR I can try to be smart.
    // Let's write the code to insert `ui_type`.

    const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            title,
            content,
            ui_type: type, // Assuming column name is ui_type
        })
        .select('id')
        .single()

    console.log('[createPost] Post insert result:', { post, error: postError, data: { user_id: userId, title, content, ui_type: type } })

    if (postError) {
        console.error('Error creating post:', postError)
        return { error: 'Failed to create post. ' + postError.message }
    }

    // 3. Handle Tags
    if (tags.length > 0) {
        for (const tagName of tags) {
            // Check if tag exists
            let { data: tag, error: tagError } = await supabase
                .from('tags')
                .select('id')
                .eq('name', tagName)
                .single()

            if (!tag) {
                // Create new tag
                const { data: newTag, error: createTagError } = await supabase
                    .from('tags')
                    .insert({ name: tagName })
                    .select('id')
                    .single()

                if (createTagError) {
                    console.error('Error creating tag:', createTagError)
                    continue // Skip this tag if failed
                }
                tag = newTag
            }

            if (tag) {
                // Link post and tag
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
