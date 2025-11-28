'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const isNewPost = pathname === '/posts/new'
    const isDetail = pathname.startsWith('/posts/') && !isNewPost

    // variantの選択
    const variantKey = isNewPost ? 'sheet' : (isDetail ? 'detail' : 'none')

    const variants = {
        sheet: {
            initial: { y: '100%', x: 0, opacity: 0 },
            animate: { y: 0, x: 0, opacity: 1 },
            exit: { y: 0, x: '100%', opacity: 0, transition: { duration: 0.2 } } // 右へスワイプ
        },
        detail: {
            initial: { scale: 0.95, x: 0, opacity: 0 },
            animate: { scale: 1, x: 0, opacity: 1 },
            exit: { scale: 1, x: '100%', opacity: 0, transition: { duration: 0.2 } }
        },
        none: {
            initial: { opacity: 1, x: 0, y: 0 },
            animate: { opacity: 1, x: 0, y: 0 },
            exit: { opacity: 1 }
        }
    }

    return (
        <motion.div
            key={pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white min-h-screen origin-center" // originを設定して拡大の中心を安定させる
        >
            {children}
        </motion.div>
    )
}
