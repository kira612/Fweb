import { Badge } from "@/components/ui/badge";
import PostTypeBadge from "@/components/ui/PostTypeBadge";
import DateFormatter from "@/components/ui/DateFormatter";
import UserAvatar from "@/components/UserAvatar";
import LikeButton from "@/components/features/LikeButton";
import DeleteButton from "@/components/DeleteButton";
import { Post } from "@/types";
import Link from "next/link";
import EditArticleButton from "@/components/features/post-detail/EditArticleButton";

interface PostHeaderProps {
    post: Post;
    currentUserId?: string;
    isOwner: boolean;
    likeCount: number;
    userLike: any;
}

export default function PostHeader({ post, currentUserId, isOwner, likeCount, userLike }: PostHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PostTypeBadge type={post.ui_type} />
                    <DateFormatter date={post.created_at} className="text-sm text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                    {isOwner && post.ui_type === 'Article' && (
                        <EditArticleButton postId={post.id} initialContent={post.content} />
                    )}
                    {isOwner && <DeleteButton postId={post.id} />}
                </div>
            </div>

            {/* Title and Like Button */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight flex-1">{post.title}</h1>
                <LikeButton
                    postId={post.id}
                    initialIsLiked={!!userLike}
                    initialCount={likeCount || 0}
                    userId={currentUserId}
                />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserAvatar
                    avatarUrl={post.user.avatar_url}
                    displayName={post.user.display_name}
                    size="sm"
                    userId={post.user.id}
                />
                <Link href={`/users/${post.user.id}`} className="hover:underline hover:text-foreground transition-colors">
                    {post.user.display_name || "名無し学生"}
                </Link>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                            #{tag.name}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
