import { Bell, PenLine, LogIn } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
    const supabase = createClient();

    // Get auth user
    const { data: { user } } = await supabase.auth.getUser();

    // Get profile if user exists
    let currentUser = null;
    if (user) {
        const { data } = await supabase
            .from('users')
            .select('id, display_name, avatar_url')
            .eq('id', user.id)
            .single();
        currentUser = data;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4">
                <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    Campus Connect
                </Link>
                <SearchInput />
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link href="/posts/new">
                                <Button size="sm" className="gap-2 hidden sm:flex">
                                    <PenLine className="h-4 w-4" />
                                    投稿する
                                </Button>
                            </Link>
                            <button className="p-2 hover:bg-accent rounded-full transition-colors">
                                <Bell className="h-5 w-5" />
                            </button>

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
