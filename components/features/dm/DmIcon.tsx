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

    useEffect(() => {
        const channel = supabase
            .channel('dm-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${userId}`,
                },
                (payload) => {
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    return (
        <div className="relative">
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
            )}
        </div>
    );
}
