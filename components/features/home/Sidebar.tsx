import Link from "next/link";
import TagList from "@/components/TagList";
import { Tag } from "@/types";
import FadeIn from "@/components/ui/FadeIn";

interface SidebarProps {
    popularTags: Tag[];
    isLoggedIn: boolean;
}

export default function Sidebar({ popularTags, isLoggedIn }: SidebarProps) {
    return (
        <FadeIn className="space-y-6" delay={0.2}>
            {/* Favorites Link (Logged-in users only) */}

            {/* Popular Tags */}
            <TagList tags={popularTags} />
        </FadeIn>
    );
}
