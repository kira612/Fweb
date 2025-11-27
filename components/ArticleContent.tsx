import { Badge } from "@/components/ui/badge";
import { User, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "@/types";

interface ArticleContentProps {
    post: Post;
}

export default function ArticleContent({ post }: ArticleContentProps) {
    return (
        <article className="bg-white pb-8 pt-6 border-b">
            <div className="container max-w-2xl space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant={post.ui_type === "Article" ? "default" : "secondary"}>
                            {post.ui_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ja,
                            })}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {/* Defensive coding for users object */}
                                <span>{post.users?.display_name || "名無し学生"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {/* Defensive coding for post_tags array */}
                        {post.post_tags?.map((pt: any) => (
                            <Badge key={pt.tags?.name} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {pt.tags?.name || "Unknown"}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || ""}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}
