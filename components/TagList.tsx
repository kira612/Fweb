import { Badge } from "@/components/ui/badge"
import { Tag as TagIcon } from "lucide-react"
import Link from "next/link"

type Tag = {
    id: string
    name: string
    count?: number
}

type TagListProps = {
    tags: Tag[]
    title?: string
}

export default function TagList({ tags, title = "人気のタグ" }: TagListProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground px-1">{title}</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link key={tag.id} href={`/search?tag=${encodeURIComponent(tag.name)}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag.name}
                            {tag.count !== undefined && <span className="ml-1 text-xs">({tag.count})</span>}
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>
    )
}
