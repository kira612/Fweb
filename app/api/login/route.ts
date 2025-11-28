import { loginWithUsername } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const formData = await request.formData()
    const username = formData.get('username') as string

    console.log('[API/login] Login attempt for username:', username)

    if (!username) {
        return NextResponse.json({ error: 'ユーザー名を入力してください' }, { status: 400 })
    }

    const result = await loginWithUsername(username)

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 })
    }

    console.log('[API/login] Login successful:', result.user?.id)
    return NextResponse.json({ success: true })
}
