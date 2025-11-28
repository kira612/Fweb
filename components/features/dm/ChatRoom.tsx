'use client'

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/sendMessage";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import clsx from "clsx";
import DateFormatter from "@/components/ui/DateFormatter";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
}

interface User {
    id: string;
    display_name: string;
    avatar_url: string;
}

interface ChatRoomProps {
    initialMessages: Message[];
    currentUser: User;
    partnerUser: User;
}

export default function ChatRoom({ initialMessages, currentUser, partnerUser }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    // Check if the message belongs to this conversation
                    if (
                        (newMsg.sender_id === currentUser.id && newMsg.receiver_id === partnerUser.id) ||
                        (newMsg.sender_id === partnerUser.id && newMsg.receiver_id === currentUser.id)
                    ) {
                        setMessages((prev) => [...prev, newMsg]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, currentUser.id, partnerUser.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        const formData = new FormData();
        formData.append("content", newMessage);
        formData.append("receiverId", partnerUser.id);

        // Optimistic update (optional, but good for UX)
        // For now, we rely on Realtime or the server response to update the list
        // to avoid duplicate keys if we add it manually and then Realtime adds it too.
        // But since Realtime is fast, we can just wait for it or the action result.

        const result = await sendMessage(formData);

        if (result?.success) {
            setNewMessage("");
            // If Realtime is slow, we could add it here, but usually Realtime catches it.
            // Let's rely on Realtime for consistency.
        } else {
            alert("送信に失敗しました");
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
                <UserAvatar
                    avatarUrl={partnerUser.avatar_url}
                    displayName={partnerUser.display_name}
                    size="md"
                    userId={partnerUser.id}
                />
                <div>
                    <h2 className="font-bold">{partnerUser.display_name}</h2>
                    <p className="text-xs text-muted-foreground">@{partnerUser.display_name}</p>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isSelf = msg.sender_id === currentUser.id;
                    return (
                        <div
                            key={msg.id}
                            className={clsx("flex gap-2", isSelf ? "justify-end" : "justify-start")}
                        >
                            {!isSelf && (
                                <UserAvatar
                                    avatarUrl={partnerUser.avatar_url}
                                    displayName={partnerUser.display_name}
                                    size="sm"
                                    className="mt-1"
                                />
                            )}
                            <div
                                className={clsx(
                                    "max-w-[70%] p-3 rounded-2xl text-sm whitespace-pre-wrap",
                                    isSelf
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none"
                                )}
                            >
                                {msg.content}
                                <div className={clsx("text-[10px] mt-1 opacity-70", isSelf ? "text-right" : "text-left")}>
                                    <DateFormatter date={msg.created_at} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
