import { createClient } from '@/utils/supabase/server'
import ProfileForm from '@/components/ProfileForm'
import RegisterForm from '@/components/RegisterForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const supabase = createClient()

    // Get auth user
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[ProfilePage] Auth user:', user?.id)

    // If no user, show registration form (or redirect to login)
    if (!user) {
        console.log('[ProfilePage] No auth user found, showing registration form')
        return <RegisterForm />
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single()

    console.log('[ProfilePage] User data:', userData, 'Error:', error)

    // Fallback to auth metadata if public profile is missing
    const initialData = userData || {
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar_url: user.user_metadata?.avatar_url || ''
    }

    return <ProfileForm initialData={initialData} />
}
