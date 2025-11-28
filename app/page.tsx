import { PenLine } from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/lib/services/posts";
import { getPopularTags } from "@/lib/services/tags";
import PostCard from "@/components/PostCard";
import AppHeader from "@/components/AppHeader";
import TagList from "@/components/TagList";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function Home() {
    // Parallel data fetching for better performance
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;

    // Fetch all data in parallel
    const [posts, popularTags, currentUser] = await Promise.all([
        getPosts(),
        getPopularTags(),
        userId ? (async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('users')
                .select('id, display_name, avatar_url')
                .eq('id', userId)
                .single();
            return data;
        })() : Promise.resolve(null)
    ]);

    return (
        <main className="min-h-screen bg-background pb-20">
            <AppHeader currentUser={currentUser} />

            <div className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <TagList tags={popularTags} />
                </aside>
            </div>

            {/* FAB */}
            <Link
                href="/posts/new"
                className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
            >
                <PenLine className="h-6 w-6" />
            </Link>
        </main>
    );
}
