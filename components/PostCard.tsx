import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, User, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Post } from "@/types";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const category = post.post_tags?.[0]?.tags?.name || "未分類";
    const author = post.users?.display_name || "名無し";
    const type = post.ui_type || "Talk";
    const comments = post.comments?.[0]?.count || 0;
    const date = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ja });

    return (
        <Link href={`/posts/${post.id}`} className="block transition-transform hover:scale-[1.01]">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <Badge variant={type === 'Article' ? 'default' : 'secondary'}>
                                {type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{date}</span>
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
