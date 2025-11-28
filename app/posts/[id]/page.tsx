import { notFound } from "next/navigation";
import { getPostById } from "@/lib/services/posts";
import { getCommentsByPostId } from "@/lib/services/comments";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { createClient } from "@/utils/supabase/server";
import PostHeader from "@/components/features/post-detail/PostHeader";
import PostContent from "@/components/features/post-detail/PostContent";
import CommentSection from "@/components/features/post-detail/CommentSection";

export const revalidate = 0;

export default async function PostPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    // Parallel data fetching for better performance
    const [post, comments, { count: likeCount }, { data: userLike }] = await Promise.all([
        getPostById(params.id),
        getCommentsByPostId(params.id),
        // Get like count
        supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', params.id),
        // Get user's like status
        currentUserId ? supabase
            .from('post_likes')
            .select('user_id')
            .eq('post_id', params.id)
            .eq('user_id', currentUserId)
            .single() : Promise.resolve({ data: null })
    ]);

    if (!post) {
        notFound();
    }

    const isOwner = currentUserId === post.user.id;

    return (
        <main className="min-h-screen pb-24 bg-slate-50">
            {/* Toolbar */}
            <div className="bg-white border-b">
                <div className="container max-w-2xl h-14 flex items-center">
                    <BackButton />
                </div>
            </div>

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
                    <PostHeader
                        post={post}
                        currentUserId={currentUserId}
                        isOwner={isOwner}
                        likeCount={likeCount || 0}
                        userLike={userLike}
                    />
                    <PostContent content={post.content} />
                </div>
            </article>

            <CommentSection
                comments={comments}
                currentUserId={currentUserId}
                postId={params.id}
            />
        </main>
    );
}
