'use client'

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/sendMessage";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image as ImageIcon, X } from "lucide-react";
import clsx from "clsx";
import DateFormatter from "@/components/ui/DateFormatter";
import Image from "next/image";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string | null;
    image_url: string | null;
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
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, previewUrl]);

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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || isSending) return;

        setIsSending(true);
        const formData = new FormData();
        formData.append("receiverId", partnerUser.id);
        if (newMessage.trim()) {
            formData.append("content", newMessage);
        }
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        const result = await sendMessage(formData);

        if (result?.success) {
            setNewMessage("");
            clearImage();
        } else {
            alert("送信に失敗しました");
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Image Zoom Modal */}
            {enlargedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
                    onClick={() => setEnlargedImage(null)}
                >
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                        <Image
                            src={enlargedImage}
                            alt="Enlarged view"
                            fill
                            className="object-contain"
                            quality={100}
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                            onClick={() => setEnlargedImage(null)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}

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
                            <div className={clsx("flex flex-col gap-1 max-w-[70%]", isSelf ? "items-end" : "items-start")}>
                                <div
                                    className={clsx(
                                        "p-3 rounded-2xl text-sm whitespace-pre-wrap break-words",
                                        isSelf
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none"
                                    )}
                                >
                                    {msg.image_url && (
                                        <div
                                            className="relative w-48 h-48 mb-2 rounded-lg overflow-hidden bg-black/10 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setEnlargedImage(msg.image_url)}
                                        >
                                            <Image
                                                src={msg.image_url}
                                                alt="Sent image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    {msg.content && <span>{msg.content}</span>}
                                    <div className={clsx("text-[10px] mt-1 opacity-70", isSelf ? "text-right" : "text-left")}>
                                        <DateFormatter date={msg.created_at} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t bg-background">
                {previewUrl && (
                    <div className="mb-2 relative inline-block">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        </div>
                        <button
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || (!newMessage.trim() && !selectedImage)}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
