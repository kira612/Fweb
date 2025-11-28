'use client';

import { createContext, useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

type TransitionDirection = 'forward' | 'back' | null;

interface OriginRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface TransitionContextType {
    direction: TransitionDirection;
    originRect: OriginRect | null;
    setOriginRect: (rect: OriginRect | null) => void;
}

const TransitionContext = createContext<TransitionContextType>({
    direction: null,
    originRect: null,
    setOriginRect: () => { },
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const historyRef = useRef<string[]>([]);
    const [direction, setDirection] = useState<TransitionDirection>(null);
    const [originRect, setOriginRect] = useState<OriginRect | null>(null);

    // Initialize history only once
    useEffect(() => {
        if (historyRef.current.length === 0) {
            historyRef.current.push(pathname);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useLayoutEffect(() => {
        const currentPath = pathname;
        const history = historyRef.current;

        // If history is empty (first render), just push
        if (history.length === 0) {
            history.push(currentPath);
            return;
        }

        const lastPath = history[history.length - 1];
        const previousPath = history[history.length - 2];

        if (currentPath === lastPath) {
            // Same path, do nothing
            return;
        }

        if (currentPath === previousPath) {
            // Back navigation
            setDirection('back');
            history.pop();
            setOriginRect(null);
        } else {
            // Forward navigation
            setDirection('forward');
            history.push(currentPath);
        }
    }, [pathname]);

    // Reset originRect after animation
    useEffect(() => {
        if (originRect) {
            const timer = setTimeout(() => {
                setOriginRect(null);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <TransitionContext.Provider value={{ direction, originRect, setOriginRect }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    return useContext(TransitionContext);
}
