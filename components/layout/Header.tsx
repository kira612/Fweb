import { Heart, LogIn } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import UserAvatar from "@/components/UserAvatar";
import DmIcon from "@/components/features/dm/DmIcon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
    const supabase = createClient();

    // Get auth user
    const { data: { user } } = await supabase.auth.getUser();

    // Get profile if user exists
    let currentUser = null;
    let unreadCount = 0;
    if (user) {
        const { data } = await supabase
            .from('users')
            .select('id, display_name, avatar_url')
            .eq('id', user.id)
            .single();
        currentUser = data;

        const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false);
        unreadCount = count || 0;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4">
                <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    福公大掲示板β
                </Link>
                <SearchInput />
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link href="/messages">
                                <div className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                                    <DmIcon initialUnreadCount={unreadCount} userId={currentUser.id} />
                                </div>
                            </Link>
                            <Link href="/favorites">
                                <div className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                                    <Heart className="h-5 w-5" />
                                </div>
                            </Link>

                            <Link href="/profile">
                                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                                    <UserAvatar
                                        avatarUrl={currentUser?.avatar_url}
                                        displayName={currentUser?.display_name}
                                        size="sm"
                                    />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" variant="default" className="gap-2">
                                <LogIn className="h-4 w-4" />
                                ログイン
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
