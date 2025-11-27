import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageCircle, PenLine, Search, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export const revalidate = 0; // Disable caching for now to see updates immediately

export default async function Home() {
    const supabase = createClient();

    // Fetch Posts
    const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
            *,
            users (
                display_name
            ),
            post_tags (
                tags (
                    name
                )
            ),
            comments (count)
        `)
        .order("created_at", { ascending: false });

    if (postsError) {
        console.error("Error fetching posts:", postsError);
    }

    const posts = postsData?.map((post) => ({
        id: post.id,
        title: post.title,
        category: post.post_tags?.[0]?.tags?.name || "未分類", // Just taking the first tag for now as category
        author: post.users?.display_name || "名無し",
        type: post.ui_type || "Talk", // Default to Talk if null (though we enforced it)
        likes: 0, // No likes table yet
        comments: post.comments?.[0]?.count || 0,
        date: formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ja }),
    })) || [];

    // Fetch Popular Tags
    // We want to order by usage count. 
    // Since we can't easily order by relation count in a simple query without RPC or view,
    // we'll fetch tags and their counts, then sort in JS.
    const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select(`
            name,
            post_tags (count)
        `);

    if (tagsError) {
        console.error("Error fetching tags:", tagsError);
    }

    const popularTags = tagsData
        ?.map((tag) => ({
            name: tag.name,
            count: tag.post_tags?.[0]?.count || 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10
        .map(t => t.name) || [];

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="font-bold text-xl tracking-tight">Campus Connect</div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-accent rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-accent rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
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
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-secondary/80 px-3 py-1 text-sm font-normal"
                                >
                                    {tag}
                                </Badge>
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
                                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2">{post.category}</Badge>
                                            <span className="text-xs text-muted-foreground">{post.date}</span>
                                        </div>
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.author}
                                            </span>
                                            <span>•</span>
                                            <span>{post.type}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="text-muted-foreground text-sm gap-4 pt-2">
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4" />
                                            <span>{post.comments}</span>
                                        </div>
                                    </CardFooter>
                                </Card>
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
