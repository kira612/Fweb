import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import DeleteButton from "@/components/DeleteButton";
import { cookies } from "next/headers";
import { getPostById } from "@/lib/services/posts";
import { getCommentsByPostId } from "@/lib/services/comments";
import ArticleContent from "@/components/ArticleContent";
import CommentList from "@/components/CommentList";

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

            <ArticleContent post={post} />

            <CommentList comments={comments} currentUserId={currentUserId} />

            {/* Comment Form */}
            <CommentForm postId={params.id} />
        </main>
    );
}
