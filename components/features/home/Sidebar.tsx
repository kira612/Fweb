import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import TagList from "@/components/TagList";
import { Tag } from "@/types";

interface SidebarProps {
    popularTags: Tag[];
    isLoggedIn: boolean;
}

export default function Sidebar({ popularTags, isLoggedIn }: SidebarProps) {
    return (
        <aside className="space-y-6">
            {/* Favorites Link (Logged-in users only) */}
            {isLoggedIn && (
                <Link href="/favorites">
                    <Button variant="outline" className="w-full gap-2 justify-start">
                        <Heart className="h-4 w-4 text-red-500" />
                        お気に入り
                    </Button>
                </Link>
            )}

            {/* Popular Tags */}
            <TagList tags={popularTags} />
        </aside>
    );
}
