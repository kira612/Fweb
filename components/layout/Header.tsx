import { Heart, LogIn } from "lucide-react";
import * as motion from "framer-motion/client";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import UserAvatar from "@/components/UserAvatar";
import DmIcon from "@/components/features/dm/DmIcon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import SpringButton from "@/components/ui/SpringButton";

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
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4">
                <Link href="/">
                    <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="font-bold text-xl tracking-tight text-gradient-main"
                    >
                        福公大掲示板β
                    </motion.div>
                </Link>
                <SearchInput />
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link href="/messages">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                                >
                                    <DmIcon initialUnreadCount={unreadCount} userId={currentUser.id} />
                                </motion.div>
                            </Link>
                            <Link href="/favorites">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                                >
                                    <Heart className="h-5 w-5" />
                                </motion.div>
                            </Link>

                            <Link href="/profile">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="cursor-pointer"
                                >
                                    <UserAvatar
                                        avatarUrl={currentUser?.avatar_url}
                                        displayName={currentUser?.display_name}
                                        size="sm"
                                    />
                                </motion.div>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login">
                            <SpringButton asChild>
                                <Button size="sm" variant="default" className="gap-2">
                                    <LogIn className="h-4 w-4" />
                                    ログイン
                                </Button>
                            </SpringButton>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
