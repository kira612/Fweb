import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import PostFeed from "@/components/features/home/PostFeed";
import { getPosts } from "@/lib/services/posts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import SpringButton from "@/components/ui/SpringButton";
import BackButton from "@/components/ui/BackButton";

export const revalidate = 0;

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // Fetch user profile
    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !profile) {
        notFound();
    }

    // Fetch user's posts
    const posts = await getPosts(params.id);

    const isOwnProfile = currentUser?.id === params.id;

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="container py-8 max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <BackButton />
                    <div className="font-bold text-lg">{profile.display_name}</div>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col items-center space-y-4">
                    <UserAvatar
                        avatarUrl={profile.avatar_url}
                        displayName={profile.display_name}
                        size="lg"
                        className="h-24 w-24"
                    />
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                        {!isOwnProfile && currentUser && (
                            <Link href={`/messages/${profile.id}`}>
                                <SpringButton asChild>
                                    <Button variant="outline" className="gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        メッセージを送る
                                    </Button>
                                </SpringButton>
                            </Link>
                        )}
                    </div>
                </div>

                {/* User's Posts */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">
                        {profile.display_name}さんの投稿
                    </h2>
                    {posts.length > 0 ? (
                        <PostFeed posts={posts} />
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            まだ投稿がありません
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
