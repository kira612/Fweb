'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'ログインが必要です' };
    }

    const content = formData.get('content') as string;
    const receiverId = formData.get('receiverId') as string;

    if (!content || !receiverId) {
        return { error: 'メッセージ内容と送信先が必要です' };
    }

    const { data, error } = await supabase
        .from('messages')
        .insert({
            sender_id: user.id,
            receiver_id: receiverId,
            content: content,
        })
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        return { error: 'メッセージの送信に失敗しました' };
    }

    // Revalidate the chat room and inbox
    revalidatePath(`/messages/${receiverId}`);
    revalidatePath('/messages');

    return { success: true, data };
}
