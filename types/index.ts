export interface User {
    id: string;
    display_name: string;
    avatar_url?: string | null;
    is_guest?: boolean;
}

export interface Tag {
    id: string;
    name: string;
    count?: number;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user: User;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    ui_type: 'Article' | 'Talk';
    image_url?: string | null;
    created_at: string;
    user: User;
    tags: Tag[];
    likes_count: number;
    comments_count: number;
}

// Helper type for Supabase joins which might return arrays or nulls
export interface PostWithRelations extends Omit<Post, 'user' | 'tags'> {
    user_id: string;
    users: User;
    post_tags: { tags: Tag }[];
    comments: { count: number }[];
    post_likes: { count: number }[];
}
