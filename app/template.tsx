'use client';

import { motion } from 'framer-motion';
import { useTransition } from '@/components/providers/TransitionProvider';

export default function Template({ children }: { children: React.ReactNode }) {
    const { direction } = useTransition();

    const variants = {
        enter: (direction: string) => ({
            y: direction === 'back' ? 0 : 20,
            x: direction === 'back' ? 0 : 0,
            opacity: 0,
            scale: direction === 'back' ? 0.95 : 1,
            zIndex: 1
        }),
        center: {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 30
            }
        },
        exit: (direction: string) => ({
            y: direction === 'back' ? 0 : -20, // Forward exit: slight slide up
            x: direction === 'back' ? '100%' : 0, // Back exit: slide right
            opacity: direction === 'back' ? 1 : 0, // Back exit: keep opacity (slide out)
            zIndex: direction === 'back' ? 50 : 0, // Back exit: on top
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 30
            }
        })
    };

    return (
        <motion.div
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen bg-background"
        >
            {children}
        </motion.div>
    );
}
