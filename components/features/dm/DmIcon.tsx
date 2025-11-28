'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageCircle } from "lucide-react";
import clsx from "clsx";

interface DmIconProps {
    initialUnreadCount: number;
    userId: string;
}

export default function DmIcon({ initialUnreadCount, userId }: DmIconProps) {
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const supabase = createClient();

    useEffect(() => {
        setUnreadCount(initialUnreadCount);
    }, [initialUnreadCount]);

    const fetchCount = async () => {
        const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('is_read', false);
        setUnreadCount(count || 0);
    };

    useEffect(() => {
        // Fetch on mount to ensure accuracy if navigated from client-side cache
        fetchCount();

        const channel = supabase
            .channel('dm-notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${userId}`,
                },
                () => {
                    fetchCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return (
        <div className="relative">
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-black ring-2 ring-background" />
            )}
        </div>
    );
}
