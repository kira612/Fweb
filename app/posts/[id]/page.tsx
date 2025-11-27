import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { User, Calendar, Tag, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import DeleteButton from "@/components/DeleteButton";
import { cookies } from "next/headers";
import clsx from "clsx";

export const revalidate = 0;

export default async function PostPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const cookieStore = cookies();
    const currentUserId = cookieStore.get("user_id")?.value;

    // Fetch Post
    const { data: post, error: postError } = await supabase
        .from("posts")
        .select(`
      *,
      users (
        display_name,
        avatar_url
      ),
      post_tags (
        tags (
          name
        )
      ),
      post_likes (count)
    `)
        .eq("id", params.id)
        .single();

    if (postError || !post) {
        console.error("Error fetching post:", postError);
        notFound();
    }

    // Check if current user liked the post
    let isLiked = false;
    if (currentUserId) {
        const { data: likeData } = await supabase
            .from("post_likes")
            .select("user_id")
            .eq("post_id", params.id)
            .eq("user_id", currentUserId)
            .single();
        isLiked = !!likeData;
    }

    // Fetch Comments
    const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select(`
      *,
      users (
        display_name,
        avatar_url
      )
    `)
        .eq("post_id", params.id)
        .order("created_at", { ascending: true });

    const isOwner = currentUserId === post.user_id;
    const likeCount = post.post_likes?.[0]?.count || 0;

    return (
        <main className="min-h-screen pb-24 bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container max-w-2xl py-4 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            戻る
                        </Button>
                    </Link>
                    {isOwner && <DeleteButton postId={post.id} />}
                </div>
            </header>

            {/* Article Section */}
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
                                    <span>{post.users?.display_name || "名無し学生"}</span>
                                </div>
                            </div>

                            <LikeButton
                                postId={post.id}
                                initialIsLiked={isLiked}
                                initialCount={likeCount}
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {post.post_tags?.map((pt: any) => (
                                <Badge key={pt.tags.name} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {pt.tags.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="prose prose-stone dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <section className="container max-w-2xl py-8 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    コメント
                    <Badge variant="secondary" className="rounded-full">
                        {comments?.length || 0}
                    </Badge>
                </h2>

                <div className="space-y-4">
                    {comments?.map((comment) => {
                        const isSelf = comment.user_id === currentUserId;
                        return (
                            <div
                                key={comment.id}
                                className={clsx("flex gap-3", isSelf ? "flex-row-reverse" : "flex-row")}
                            >
                                {/* Avatar / Icon */}
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                        <User className="h-5 w-5 text-slate-500" />
                                    </div>
                                </div>

                                <div className={clsx("max-w-[80%] space-y-1", isSelf ? "items-end" : "items-start")}>
                                    <div className={clsx("text-xs text-muted-foreground px-1", isSelf && "text-right")}>
                                        {comment.users?.display_name || "名無し"}
                                    </div>
                                    <div
                                        className={clsx(
                                            "p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm",
                                            isSelf
                                                ? "bg-green-100 text-green-900 rounded-tr-none"
                                                : "bg-white text-slate-900 rounded-tl-none"
                                        )}
                                    >
                                        {comment.content}
                                    </div>
                                    <div className={clsx("text-[10px] text-muted-foreground px-1", isSelf && "text-right")}>
                                        {formatDistanceToNow(new Date(comment.created_at), {
                                            addSuffix: true,
                                            locale: ja,
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {comments?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            まだコメントはありません。最初のコメントを投稿しましょう！
                        </div>
                    )}
                </div>
            </section>

            {/* Comment Form */}
            <CommentForm postId={params.id} />
        </main>
    );
}
