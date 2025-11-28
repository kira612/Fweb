import MarkdownViewer from "@/components/ui/MarkdownViewer";

interface PostContentProps {
    content: string;
}

export default function PostContent({ content }: PostContentProps) {
    if (!content) return null;

    return (
        <div className="mt-6">
            <MarkdownViewer content={content} />
        </div>
    );
}
