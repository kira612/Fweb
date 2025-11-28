import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import DateFormatter from "@/components/ui/DateFormatter";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all messages involving the current user
    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(id, display_name, avatar_url),
            receiver:receiver_id(id, display_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
        return <div>Error loading messages</div>;
    }

    // Extract unique conversation partners
    const conversationsMap = new Map();

    messages?.forEach((msg) => {
        const partner = msg.sender_id === user.id ? msg.receiver : msg.sender;
        if (!partner) return;

        if (!conversationsMap.has(partner.id)) {
            conversationsMap.set(partner.id, {
                partner,
                lastMessage: msg,
            });
        }
    });

    const conversations = Array.from(conversationsMap.values());

    return (
        <div className="container max-w-2xl mx-auto py-8 space-y-6">
            <h1 className="text-2xl font-bold">メッセージ</h1>

            {conversations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    まだメッセージはありません。
                    <br />
                    気になるユーザーのプロフィールからメッセージを送ってみましょう！
                </div>
            ) : (
                <div className="space-y-2">
                    {conversations.map(({ partner, lastMessage }) => (
                        <Link key={partner.id} href={`/messages/${partner.id}`} className="block">
                            <Card className="p-4 hover:bg-accent/50 transition-colors flex items-center gap-4">
                                <UserAvatar
                                    avatarUrl={partner.avatar_url}
                                    displayName={partner.display_name}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold truncate">{partner.display_name}</h3>
                                        <DateFormatter date={lastMessage.created_at} className="text-xs text-muted-foreground flex-shrink-0" />
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {lastMessage.sender_id === user.id && "あなた: "}
                                        {lastMessage.content}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
