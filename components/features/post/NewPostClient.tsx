'use client'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArticlePostForm from '@/components/features/post/ArticlePostForm'
import TalkPostForm from '@/components/features/post/TalkPostForm'

export default function NewPostClient() {
    const [postType, setPostType] = useState<'Article' | 'Talk'>('Talk')

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="font-bold text-lg">新規投稿</div>
                </div>
            </div>

            <div className="container py-6 max-w-2xl mx-auto">
                {/* Post Type Selection */}
                <div className="space-y-2 mb-8">
                    <Label>投稿タイプ</Label>
                    <RadioGroup
                        value={postType}
                        onValueChange={(value) => setPostType(value as 'Article' | 'Talk')}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="relative">
                            <RadioGroupItem value="Article" id="article" className="peer sr-only" />
                            <Label
                                htmlFor="article"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer relative z-10 h-full"
                            >
                                {postType === 'Article' && (
                                    <motion.div
                                        layoutId="active-post-type"
                                        className="absolute inset-0 border-2 border-primary rounded-md z-[-1]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <BookOpen className="mb-3 h-6 w-6" />
                                <div className="text-center">
                                    <div className="font-semibold">Article</div>
                                    <div className="text-xs text-muted-foreground mt-1">しっかり共有</div>
                                </div>
                            </Label>
                        </div>
                        <div className="relative">
                            <RadioGroupItem value="Talk" id="talk" className="peer sr-only" />
                            <Label
                                htmlFor="talk"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer relative z-10 h-full"
                            >
                                {postType === 'Talk' && (
                                    <motion.div
                                        layoutId="active-post-type"
                                        className="absolute inset-0 border-2 border-primary rounded-md z-[-1]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <MessageCircle className="mb-3 h-6 w-6" />
                                <div className="text-center">
                                    <div className="font-semibold">Talk</div>
                                    <div className="text-xs text-muted-foreground mt-1">気軽につぶやく</div>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Render appropriate form based on selected type */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {postType === 'Article' ? (
                            <motion.div
                                key="Article"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <ArticlePostForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="Talk"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <TalkPostForm />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    )
}
