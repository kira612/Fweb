import { getPosts } from "@/lib/services/posts";
import { getPopularTags } from "@/lib/services/tags";
import { createClient } from "@/utils/supabase/server";
import CreatePostFab from "@/components/features/CreatePostFab";
import PostFeed from "@/components/features/home/PostFeed";
import Sidebar from "@/components/features/home/Sidebar";

export const revalidate = 0;

export default async function Home() {
    // Parallel data fetching for better performance
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    // Fetch all data in parallel
    const [posts, popularTags] = await Promise.all([
        getPosts(),
        getPopularTags(),
    ]);

    return (
        <main className="min-h-screen bg-background pb-20">

            <div className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    <PostFeed posts={posts} />
                </div>

                {/* Sidebar */}
                <Sidebar popularTags={popularTags} isLoggedIn={isLoggedIn} />
            </div>

            {/* FAB */}
            <CreatePostFab isLoggedIn={isLoggedIn} />
        </main>
    );
}
