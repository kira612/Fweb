import { Badge } from "@/components/ui/badge";
import { Bell, PenLine, User } from "lucide-react";
import Link from "next/link";
import { searchPostsByKeyword, searchPostsByTag } from "@/lib/services/search";
import PostCard from "@/components/PostCard";
import SearchInput from "@/components/SearchInput";

export const revalidate = 0;

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string; tag?: string };
}) {
    const keyword = searchParams.q;
    const tag = searchParams.tag;

    let posts = [];
    let title = "";

    if (keyword) {
        posts = await searchPostsByKeyword(keyword);
        title = `"${keyword}" の検索結果`;
    } else if (tag) {
        posts = await searchPostsByTag(tag);
        title = `#${tag} の記事`;
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between gap-4">
                    <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80">
                        Campus Connect
                    </Link>
                    <SearchInput />
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-accent rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </header>

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
            <Link href="/posts/new">
                <button className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <PenLine className="h-6 w-6" />
                </button>
            </Link>
        </main>
    );
}
