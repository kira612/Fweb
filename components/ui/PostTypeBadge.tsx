import { Badge } from "@/components/ui/badge";

interface PostTypeBadgeProps {
    type: 'Article' | 'Talk';
    className?: string;
}

export default function PostTypeBadge({ type, className }: PostTypeBadgeProps) {
    return (
        <Badge
            variant={type === 'Article' ? 'default' : 'secondary'}
            className={className}
        >
            {type}
        </Badge>
    );
}
