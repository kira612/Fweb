'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface SpringButtonProps extends HTMLMotionProps<'button'> {
    asChild?: boolean;
}

const SpringButton = forwardRef<HTMLButtonElement, SpringButtonProps>(
    ({ asChild = false, ...props }, ref) => {
        const Component = asChild ? Slot : 'button';
        const MotionComponent = motion(Component);

        return (
            <MotionComponent
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            />
        );
    }
);

SpringButton.displayName = 'SpringButton';

export default SpringButton;
