'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTransition } from '@/components/providers/TransitionProvider';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { direction, originRect } = useTransition();

    // Snapshot the originRect when the component mounts (new page loads)
    // This ensures that even if the context updates (clears rect), the animation persists
    const activeOriginRect = useRef(originRect);

    // Update ref if originRect is present (e.g. just clicked)
    // We only want to capture it if it's not null, to preserve it for the enter animation
    if (originRect) {
        activeOriginRect.current = originRect;
    }

    const variants: Variants = {
        enter: (direction: string) => {
            // Use the ref value for the animation
            const rect = activeOriginRect.current;

            if (direction !== 'back' && rect) {
                // Check if it's the FAB (small square/circle)
                const isFab = rect.width < 100 && rect.height < 100;

                if (isFab) {
                    // Tube/Megaphone animation (Circular Reveal)
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const maxRadius = Math.max(
                        window.innerWidth,
                        window.innerHeight
                    ) * 1.5;

                    return {
                        clipPath: `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        zIndex: 100,
                        transition: {
                            duration: 0.75,
                            ease: [0.76, 0, 0.24, 1],
                            clipPath: {
                                duration: 0.75,
                                ease: [0.76, 0, 0.24, 1],
                            }
                        }
                    };
                }

                // Standard Card Expansion
                return {
                    clipPath: `inset(0px 0px 0px 0px round 0px)`,
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    zIndex: 100,
                    transition: {
                        duration: 0.75,
                        ease: [0.76, 0, 0.24, 1],
                        clipPath: {
                            duration: 0.75,
                            ease: [0.76, 0, 0.24, 1],
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
            const rect = activeOriginRect.current;

            if (direction !== 'back' && rect) {
                const isFab = rect.width < 100 && rect.height < 100;

                if (isFab) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    // Start as a small circle at the FAB position
                    return {
                        clipPath: `circle(28px at ${centerX}px ${centerY}px)`,
                        opacity: 1,
                        scale: 0, // Start from scale 0 to look like it's coming OUT of the tube
                        y: 0,
                        zIndex: 100
                    }
                }

                const t = rect.top;
                const r = window.innerWidth - (rect.left + rect.width);
                const b = window.innerHeight - (rect.top + rect.height);
                const l = rect.left;
                return {
                    clipPath: `inset(${t}px ${r}px ${b}px ${l}px round 12px)`,
                    opacity: 1,
                    scale: 0.95,
                    y: 20,
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
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1]
            }
        },
        exit: (direction: string) => ({
            y: direction === 'back' ? 0 : -20,
            x: direction === 'back' ? '100%' : 0,
            opacity: direction === 'back' ? 1 : 0,
            zIndex: direction === 'back' ? 50 : 0,
            transition: {
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1]
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
