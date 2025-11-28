import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatRoom from "@/components/features/dm/ChatRoom";

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch partner user
    const { data: partnerUser, error: userError } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('id', params.id)
        .single();

    if (userError || !partnerUser) {
        notFound();
    }

    // Fetch current user details
    const { data: currentUser } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('id', user.id)
        .single();

    if (!currentUser) {
        // Should not happen if auth check passed, but safe fallback
        redirect('/login');
    }

    // Mark messages as read
    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerUser.id)
        .eq('receiver_id', user.id)
        .eq('is_read', false);

    // Fetch messages
    const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerUser.id}),and(sender_id.eq.${partnerUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

    if (msgError) {
        console.error('Error fetching messages:', msgError);
    }

    return (
        <div className="container max-w-2xl mx-auto">
            <ChatRoom
                initialMessages={messages || []}
                currentUser={currentUser}
                partnerUser={partnerUser}
            />
        </div>
    );
}
