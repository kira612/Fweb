import Link from "next/link";
import { searchPostsByKeyword, searchPostsByTag } from "@/lib/services/search";
import PostCard from "@/components/PostCard";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CreatePostFab from "@/components/features/CreatePostFab";
import { Post } from "@/types";

export const revalidate = 0;

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string; tag?: string };
}) {
    const keyword = searchParams.q;
    const tag = searchParams.tag;

    let posts: Post[] = [];
    let title = "";

    if (keyword) {
        posts = await searchPostsByKeyword(keyword);
        title = `"${keyword}" の検索結果`;
    } else if (tag) {
        posts = await searchPostsByTag(tag);
        title = `#${tag} の記事`;
    }

    // Get current user for header
    const supabase = createClient();
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;

    let currentUser = null;
    if (userId) {
        const { data } = await supabase
            .from('users')
            .select('id, display_name, avatar_url')
            .eq('id', userId)
            .single();
        currentUser = data;
    }

    return (
        <main className="min-h-screen bg-background pb-20">

            <div className="container py-6 space-y-6">
                {/* Search Title */}
                <section>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {posts.length} 件の投稿が見つかりました
                    </p>
                </section>

                {/* Results */}
                <section className="space-y-4">
                    {posts.length > 0 ? (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">投稿が見つかりませんでした</p>
                            <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                                ホームに戻る
                            </Link>
                        </div>
                    )}
                </section>
            </div>

            {/* FAB */}
            <CreatePostFab isLoggedIn={!!userId} />
        </main>
    );
}
