'use client';

import { motion } from 'framer-motion';
import { useTransition } from '@/components/providers/TransitionProvider';

export default function Template({ children }: { children: React.ReactNode }) {
    const { direction, originRect } = useTransition();

    const variants = {
        enter: (direction: string) => {
            if (direction !== 'back' && originRect) {
                // Expansion animation
                return {
                    clipPath: `inset(0px 0px 0px 0px round 0px)`,
                    opacity: 1,
                    zIndex: 100, // Ensure it's on top
                    transition: {
                        type: 'spring' as const,
                        stiffness: 300,
                        damping: 30,
                        // Initial state for clipPath (simulated via transition start)
                        clipPath: {
                            type: 'spring' as const,
                            stiffness: 300,
                            damping: 30,
                        }
                    }
                };
            }

            return {
                y: direction === 'back' ? 0 : 20,
                x: direction === 'back' ? 0 : 0,
                opacity: 0,
                scale: direction === 'back' ? 0.95 : 1,
                zIndex: 1
            };
        },
        initial: (direction: string) => {
            if (direction !== 'back' && originRect) {
                const t = originRect.top;
                const r = window.innerWidth - (originRect.left + originRect.width);
                const b = window.innerHeight - (originRect.top + originRect.height);
                const l = originRect.left;
                return {
                    clipPath: `inset(${t}px ${r}px ${b}px ${l}px round 12px)`,
                    opacity: 1, // Start visible but clipped
                    zIndex: 100
                }
            }
            return {
                opacity: 0,
                y: direction === 'back' ? 0 : 20,
                x: direction === 'back' ? 0 : 0,
                scale: direction === 'back' ? 0.95 : 1,
            }
        },
        center: {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
            clipPath: 'inset(0px 0px 0px 0px round 0px)', // Ensure full view
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
            initial="initial"
            animate="center"
            exit="exit"
            className="min-h-screen bg-background"
        >
            {children}
        </motion.div>
    );
}
