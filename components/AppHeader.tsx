import { Bell, MessageCircle } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import UserAvatar from "@/components/UserAvatar";
import { User } from "@/types";

interface AppHeaderProps {
    currentUser?: User | null;
    title?: string;
}

export default function AppHeader({ currentUser, title = "Campus Connect" }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4">
                <div className="font-bold text-xl tracking-tight">{title}</div>
                <SearchInput />
                <div className="flex items-center gap-4">
                    <Link href="/messages">
                        <button className="p-2 hover:bg-accent rounded-full transition-colors">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </Link>
                    <button className="p-2 hover:bg-accent rounded-full transition-colors">
                        <Bell className="h-5 w-5" />
                    </button>
                    <Link href="/profile">
                        <UserAvatar
                            avatarUrl={currentUser?.avatar_url}
                            displayName={currentUser?.display_name}
                            size="sm"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
