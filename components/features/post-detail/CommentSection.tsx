'use client'

import { useEffect, useState } from "react";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import { Comment } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface CommentSectionProps {
    comments: Comment[];
    currentUserId?: string;
    postId: string;
}

export default function CommentSection({ comments: initialComments, currentUserId, postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const supabase = createClient();

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    useEffect(() => {
        const channel = supabase
            .channel('realtime-comments')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`,
                },
                async (payload) => {
                    console.log('New comment received:', payload);

                    // Fetch the new comment with user details
                    const { data: newComment, error } = await supabase
                        .from('comments')
                        .select(`
                            *,
                            user:users (
                                id,
                                display_name,
                                avatar_url
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (!error && newComment) {
                        setComments((prev) => [...prev, newComment as Comment]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId, supabase]);

    return (
        <>
            <CommentList comments={comments} currentUserId={currentUserId} />
            <CommentForm postId={postId} currentUserId={currentUserId} />
        </>
    );
}
