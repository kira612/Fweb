import { registerUser } from '@/lib/auth/auth'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const formData = await request.formData()
    const displayName = formData.get('display_name') as string
    const avatarFile = formData.get('avatar_image') as File | null

    console.log('[API/register] Registration request:', { displayName, hasAvatar: !!avatarFile })

    if (!displayName) {
        return NextResponse.json({ error: 'ユーザー名を入力してください' }, { status: 400 })
    }

    let avatarUrl: string | undefined = undefined

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
        const supabase = createClient()
        const tempId = `temp-${Date.now()}`
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${tempId}.${fileExt}`

        console.log('[API/register] Uploading avatar:', fileName)

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (!uploadError) {
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            avatarUrl = urlData.publicUrl
        }
    }

    // Register user using auth service
    const result = await registerUser(displayName, avatarUrl)

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
    }

    console.log('[API/register] User registered successfully:', result.userId)
    return NextResponse.json({ success: true })
}
