import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tag } from "@/types";

interface TagListProps {
    tags: Tag[];
    title?: string;
}

export default function TagList({ tags, title = "人気のタグ" }: TagListProps) {
    return (
        <section className="space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {title}
            </h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link key={tag.id} href={`/search?tag=${encodeURIComponent(tag.name)}`}>
                        <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            {tag.name}
                        </Badge>
                    </Link>
                ))}
            </div>
        </section>
    );
}
