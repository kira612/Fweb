'use client';

import PostCard from "@/components/PostCard";
import { Post } from "@/types";
import { motion } from "framer-motion";

interface PostFeedProps {
    posts: Post[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function PostFeed({ posts }: PostFeedProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                まだ投稿がありません
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {posts.map((post) => (
                <motion.div key={post.id} variants={item}>
                    <PostCard post={post} />
                </motion.div>
            ))}
        </motion.div>
    );
}
