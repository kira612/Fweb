'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    console.log('[updateProfile] Starting profile update for user:', userId)

    if (!userId) {
        return { error: 'User not authenticated.' }
    }

    const displayName = formData.get('display_name') as string
    const avatarFile = formData.get('avatar_image') as File | null

    console.log('[updateProfile] Form data:', { displayName, hasAvatar: !!avatarFile })

    let avatarUrl: string | undefined = undefined

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`

        console.log('[updateProfile] Uploading avatar:', fileName)

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('[updateProfile] Upload error:', uploadError)
            return { error: 'Failed to upload avatar: ' + uploadError.message }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        avatarUrl = urlData.publicUrl
        console.log('[updateProfile] Avatar uploaded:', avatarUrl)
    }

    // Update user profile
    const updateData: any = { display_name: displayName }
    if (avatarUrl) {
        updateData.avatar_url = avatarUrl
    }

    const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)

    console.log('[updateProfile] Update result:', { error: updateError })

    if (updateError) {
        console.error('[updateProfile] Update error:', updateError)
        return { error: 'Failed to update profile: ' + updateError.message }
    }

    console.log('[updateProfile] Profile updated successfully')
    revalidatePath('/')
    revalidatePath('/profile')
    redirect('/')
}
