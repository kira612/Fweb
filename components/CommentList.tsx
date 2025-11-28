import { Badge } from "@/components/ui/badge";
import DateFormatter from "@/components/ui/DateFormatter";
import UserAvatar from "@/components/UserAvatar";
import clsx from "clsx";
import { Comment } from "@/types";
import Link from "next/link";

interface CommentListProps {
    comments: Comment[];
    currentUserId?: string;
}

export default function CommentList({ comments, currentUserId }: CommentListProps) {
    return (
        <section className="container max-w-2xl py-8 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                コメント
                <Badge variant="secondary" className="rounded-full">
                    {comments?.length || 0}
                </Badge>
            </h2>

            <div className="space-y-4">
                {comments?.map((comment) => {
                    const isSelf = comment.user.id === currentUserId;
                    return (
                        <div
                            key={comment.id}
                            className={clsx("flex gap-3", isSelf ? "flex-row-reverse" : "flex-row")}
                        >

                            {/* Avatar / Icon */}
                            <div className="flex-shrink-0">
                                <UserAvatar
                                    avatarUrl={comment.user.avatar_url}
                                    displayName={comment.user.display_name}
                                    size="sm"
                                    userId={comment.user.id}
                                />
                            </div>

                            <div className={clsx("max-w-[80%] space-y-1", isSelf ? "items-end" : "items-start")}>
                                <div className={clsx("text-xs text-muted-foreground px-1", isSelf && "text-right")}>
                                    <Link href={`/users/${comment.user.id}`} className="hover:underline hover:text-foreground transition-colors">
                                        {comment.user?.display_name || "名無し"}
                                    </Link>
                                </div>
                                <div
                                    className={clsx(
                                        "p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm",
                                        isSelf
                                            ? "bg-green-100 text-green-900 rounded-tr-none"
                                            : "bg-white text-slate-900 rounded-tl-none"
                                    )}
                                >
                                    {comment.content}
                                </div>
                                <DateFormatter
                                    date={comment.created_at}
                                    className={clsx("text-[10px] text-muted-foreground px-1", isSelf && "text-right")}
                                />
                            </div>
                        </div>
                    );
                })}

                {comments?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        まだコメントはありません。最初のコメントを投稿しましょう！
                    </div>
                )}
            </div>
        </section>
    );
}
