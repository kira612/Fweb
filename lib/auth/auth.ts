import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Auth service - abstraction layer for authentication
 * Currently uses simple username-based auth
 * TODO: Migrate to Supabase Auth for email/password authentication
 */

export async function loginWithUsername(username: string) {
    const supabase = createClient()

    // Find user by display name
    const { data: user, error } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('display_name', username)
        .single()

    if (error || !user) {
        return { success: false, error: 'ユーザーが見つかりません' }
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set('user_id', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax'
    })

    return { success: true, user }
}

export async function registerUser(displayName: string, avatarUrl?: string) {
    const supabase = createClient()

    // Create user
    const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
            display_name: displayName,
            is_guest: false,
            avatar_url: avatarUrl || '',
            // TODO: Add email and password_hash when migrating to Supabase Auth
        })
        .select('id')
        .single()

    if (userError) {
        return { success: false, error: 'ユーザーの作成に失敗しました' }
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set('user_id', newUser.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax'
    })

    return { success: true, userId: newUser.id }
}

export async function getCurrentUser() {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
        return null
    }

    const supabase = createClient()
    const { data: user } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('id', userId)
        .single()

    return user
}

export async function logout() {
    const cookieStore = cookies()
    cookieStore.delete('user_id')
}

/* 
 * TODO: Future migration to Supabase Auth
 * 
 * export async function loginWithEmail(email: string, password: string) {
 *     const supabase = createClient()
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *         email,
 *         password,
 *     })
 *     return { success: !error, data, error }
 * }
 * 
 * export async function registerWithEmail(email: string, password: string, displayName: string) {
 *     const supabase = createClient()
 *     const { data, error } = await supabase.auth.signUp({
 *         email,
 *         password,
 *         options: {
 *             data: { display_name: displayName }
 *         }
 *     })
 *     return { success: !error, data, error }
 * }
 */
