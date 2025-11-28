import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, User, Tag } from "lucide-react";
import Link from "next/link";
import { Post } from "@/types";
import Image from "next/image";

interface PostCardProps {
    post: Post;
}

import PostTypeBadge from "@/components/ui/PostTypeBadge";
import DateFormatter from "@/components/ui/DateFormatter";
import UserAvatar from "@/components/UserAvatar";
import { useTransition } from '@/components/providers/TransitionProvider';

// ... (imports)

export default function PostCard({ post }: PostCardProps) {
    const category = post.tags?.[0]?.name || "未分類";
    const author = post.user?.display_name || "名無し";
    const type = post.ui_type || "Talk";
    const comments = post.comments_count || 0;
    const { setOriginRect } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setOriginRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group border-border/50 bg-card/50 backdrop-blur-sm">
            {/* Main Link (Stretched) */}
            <Link
                href={`/posts/${post.id}`}
                className="absolute inset-0 z-0"
                aria-label={post.title}
                onClick={handleClick}
            />

            {/* Image Thumbnail */}
            {post.image_url && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-[1.01]"
                    />
                </div>
            )}

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <PostTypeBadge type={type} />
                        <DateFormatter date={post.created_at} className="text-xs text-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {category}
                    </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground relative z-10">
                    <span className="flex items-center gap-1">
                        <UserAvatar
                            avatarUrl={post.user.avatar_url}
                            displayName={post.user.display_name}
                            size="sm"
                            userId={post.user.id}
                        />
                        <Link href={`/users/${post.user.id}`} className="hover:underline hover:text-foreground transition-colors">
                            {author}
                        </Link>
                    </span>
                </div>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm gap-4 pt-2">
                <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
