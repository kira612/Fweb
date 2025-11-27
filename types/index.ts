export interface User {
    id: string;
    display_name: string;
    avatar_url?: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface PostTag {
    tags: Tag;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    users?: User;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    ui_type: 'Article' | 'Talk';
    users?: User;
    post_tags?: PostTag[];
    comments?: { count: number }[];
}

export interface PostWithCounts extends Post {
    likes_count: number;
    comments_count: number;
    category: string;
    author_name: string;
}
