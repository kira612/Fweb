import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import { Comment } from "@/types";

interface CommentSectionProps {
    comments: Comment[];
    currentUserId?: string;
    postId: string;
}

export default function CommentSection({ comments, currentUserId, postId }: CommentSectionProps) {
    return (
        <>
            <CommentList comments={comments} currentUserId={currentUserId} />
            <CommentForm postId={postId} />
        </>
    );
}
