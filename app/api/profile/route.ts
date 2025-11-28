import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = createClient()
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    console.log('[API/profile] Starting profile update for user:', userId)

    if (!userId) {
        return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 })
    }

    const formData = await request.formData()
    const displayName = formData.get('display_name') as string
    const avatarFile = formData.get('avatar_image') as File | null

    console.log('[API/profile] Form data:', { displayName, hasAvatar: !!avatarFile })

    let avatarUrl: string | undefined = undefined

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`

        console.log('[API/profile] Uploading avatar:', fileName)

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('[API/profile] Upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload avatar: ' + uploadError.message }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        avatarUrl = urlData.publicUrl
        console.log('[API/profile] Avatar uploaded:', avatarUrl)
    }

    // Update user profile
    const updateData: any = { display_name: displayName }
    if (avatarUrl) {
        updateData.avatar_url = avatarUrl
    }

    const { error: updateError } = await supabase
        .from('users')
        .upsert({
            id: userId,
            ...updateData,
            updated_at: new Date().toISOString(),
        })

    console.log('[API/profile] Update result:', { error: updateError })

    if (updateError) {
        console.error('[API/profile] Update error:', updateError)
        return NextResponse.json({ error: 'Failed to update profile: ' + updateError.message }, { status: 500 })
    }

    console.log('[API/profile] Profile updated successfully')
    return NextResponse.json({ success: true })
}
