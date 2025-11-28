'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends HTMLMotionProps<'div'> {
    delay?: number;
}

export default function FadeIn({ children, delay = 0, className, ...props }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom ease for natural feel
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
