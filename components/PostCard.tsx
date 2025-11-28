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

// ... (imports)

export default function PostCard({ post }: PostCardProps) {
    const category = post.tags?.[0]?.name || "未分類";
    const author = post.user?.display_name || "名無し";
    const type = post.ui_type || "Talk";
    const comments = post.comments_count || 0;

    return (
        <Link href={`/posts/${post.id}`} className="block transition-transform hover:scale-[1.01]">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                {/* Image Thumbnail */}
                {post.image_url && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {author}
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
        </Link>
    );
}
