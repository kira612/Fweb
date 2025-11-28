import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import DeleteButton from "@/components/DeleteButton";
import { cookies } from "next/headers";
import { getPostById } from "@/lib/services/posts";
import { getCommentsByPostId } from "@/lib/services/comments";
import CommentList from "@/components/CommentList";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import MarkdownViewer from "@/components/ui/MarkdownViewer";

export const revalidate = 0;

export default async function PostPage({ params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const currentUserId = cookieStore.get("user_id")?.value;

    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    const comments = await getCommentsByPostId(params.id);
    const isOwner = currentUserId === post.user_id;

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

            {/* Image Display */}
            {post.image_url && (
                <div className="container max-w-2xl mt-6">
                    <div className="relative w-full h-96 rounded-lg overflow-hidden">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            )}


            {/* Article Content */}
            <article className="bg-white pb-8 pt-6 border-b">
                <div className="container max-w-2xl space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant={post.ui_type === "Article" ? "default" : "secondary"}>
                                {post.ui_type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserAvatar
                                avatarUrl={post.users?.avatar_url}
                                displayName={post.users?.display_name}
                                size="sm"
                            />
                            <span>{post.users?.display_name || "名無し学生"}</span>
                        </div>

                        {/* Tags */}
                        {post.post_tags && post.post_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.post_tags.map((pt: any) => (
                                    <Badge key={pt.tags?.name} variant="outline" className="text-xs">
                                        #{pt.tags?.name || "Unknown"}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content with Markdown */}
                    {post.content && (
                        <div className="mt-6">
                            <MarkdownViewer content={post.content} />
                        </div>
                    )}
                </div>
            </article>

            <CommentList comments={comments} currentUserId={currentUserId} />

            {/* Comment Form */}
            <CommentForm postId={params.id} />
        </main>
    );
}
