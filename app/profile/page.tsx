import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import ProfileForm from '@/components/ProfileForm'
import RegisterForm from '@/components/RegisterForm'

export default async function ProfilePage() {
    const supabase = createClient()
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    console.log('[ProfilePage] User ID from cookie:', userId)

    // If no user, show registration form
    if (!userId) {
        console.log('[ProfilePage] No user ID found, showing registration form')
        return <RegisterForm />
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('display_name, avatar_url')
        .eq('id', userId)
        .single()

    console.log('[ProfilePage] User data:', userData, 'Error:', error)

    return <ProfileForm initialData={userData} />
}
