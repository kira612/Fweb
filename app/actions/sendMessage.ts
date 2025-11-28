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
    const imageFile = formData.get('image') as File | null;

    if ((!content && !imageFile) || !receiverId) {
        return { error: 'メッセージ内容または画像と、送信先が必要です' };
    }

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `dm/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('message_images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return { error: '画像のアップロードに失敗しました' };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('message_images')
            .getPublicUrl(fileName);

        imageUrl = publicUrl;
    }

    const { data, error } = await supabase
        .from('messages')
        .insert({
            sender_id: user.id,
            receiver_id: receiverId,
            content: content || null, // Allow null if image is present
            image_url: imageUrl,
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
