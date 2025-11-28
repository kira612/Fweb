import Link from "next/link";
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

            {/* Popular Tags */}
            <TagList tags={popularTags} />
        </aside>
    );
}
