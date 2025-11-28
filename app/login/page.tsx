import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/')
    }

    return <LoginForm />
}
