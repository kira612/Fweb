import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NewPostClient from '@/components/features/post/NewPostClient'

export default async function NewPostPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <NewPostClient />
}
