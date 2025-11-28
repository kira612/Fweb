import PostCard from "@/components/PostCard";
import { Post } from "@/types";

interface PostFeedProps {
    posts: Post[];
}

export default function PostFeed({ posts }: PostFeedProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                まだ投稿がありません
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
