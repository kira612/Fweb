import { Badge } from "@/components/ui/badge";
import { Bell, PenLine } from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/lib/services/posts";
import { getPopularTags } from "@/lib/services/tags";
import PostCard from "@/components/PostCard";
import SearchInput from "@/components/SearchInput";
import UserAvatar from "@/components/UserAvatar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0; // Disable caching for now to see updates immediately

export default async function Home() {
    const posts = await getPosts();
    const popularTags = await getPopularTags();

    // Get current user for avatar
    const supabase = createClient();
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;

    let currentUser = null;
    if (userId) {
        const { data } = await supabase
            .from('users')
            .select('display_name, avatar_url')
            .eq('id', userId)
            .single();
        currentUser = data;
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between gap-4">
                    <div className="font-bold text-xl tracking-tight">Campus Connect</div>
                    <SearchInput />
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-accent rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <Link href="/profile">
                            <UserAvatar
                                avatarUrl={currentUser?.avatar_url}
                                displayName={currentUser?.display_name}
                                size="sm"
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container py-6 space-y-8">
                {/* Tag Cloud */}
                <section>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3">Popular Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.length > 0 ? (
                            popularTags.map((tag) => (
                                <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`}>
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-secondary/80 px-3 py-1 text-sm font-normal"
                                    >
                                        {tag}
                                    </Badge>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">タグはまだありません</p>
                        )}
                    </div>
                </section>

                {/* Article List */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Recent Posts</h2>
                    <div className="grid gap-4">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <p className="text-muted-foreground">投稿はまだありません。</p>
                        )}
                    </div>
                </section>
            </div>

            {/* FAB */}
            <Link href="/posts/new">
                <button className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <PenLine className="h-6 w-6" />
                </button>
            </Link>
        </main>
    );
}

