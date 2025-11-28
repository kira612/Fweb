'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useEffect } from 'react'

interface MarkdownViewerProps {
    content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
    useEffect(() => {
        // Dynamically import KaTeX CSS only on client side
        import('katex/dist/katex.min.css')
    }, [])

    return (
        <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown
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
        </div>
    )
}
