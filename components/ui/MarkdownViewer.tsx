import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface MarkdownViewerProps {
    content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
    return (
        <ReactMarkdown
            className="prose prose-slate max-w-none dark:prose-invert"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                // Open links in new tab
                a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
