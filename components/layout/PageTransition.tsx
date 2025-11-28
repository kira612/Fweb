'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTransition } from '@/components/providers/TransitionProvider';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { direction, originRect } = useTransition();

    const variants: Variants = {
        enter: (direction: string) => {
            if (direction !== 'back' && originRect) {
                // Expansion animation (Float up from card)
                return {
                    clipPath: `inset(0px 0px 0px 0px round 0px)`,
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    zIndex: 100,
                    transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth ease-out
                        clipPath: {
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
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
                    opacity: 1,
                    scale: 0.95, // Start slightly smaller
                    y: 20, // Start slightly lower
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
            clipPath: 'inset(0px 0px 0px 0px round 0px)',
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: (direction: string) => ({
            y: direction === 'back' ? 0 : -20,
            x: direction === 'back' ? '100%' : 0,
            opacity: direction === 'back' ? 1 : 0,
            zIndex: direction === 'back' ? 50 : 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
                key={pathname}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="center"
                exit="exit"
                className="min-h-screen bg-background"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
