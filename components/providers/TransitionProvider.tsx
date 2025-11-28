'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
    const [history, setHistory] = useState<string[]>([]);
    const [direction, setDirection] = useState<TransitionDirection>(null);
    const [originRect, setOriginRect] = useState<OriginRect | null>(null);

    useEffect(() => {
        // Initialize history on mount
        setHistory([pathname]);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (history.length === 0) return;

        const currentPath = pathname;
        const previousPath = history[history.length - 2];

        if (currentPath === previousPath) {
            // Back navigation
            setDirection('back');
            setHistory((prev) => prev.slice(0, -1));
            setOriginRect(null); // Reset origin rect on back
        } else if (currentPath !== history[history.length - 1]) {
            // Forward navigation
            setDirection('forward');
            setHistory((prev) => [...prev, currentPath]);
            // Don't reset originRect here, it should be set by the click handler before navigation
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset originRect after animation (optional, but good practice to clean up)
    useEffect(() => {
        if (originRect) {
            const timer = setTimeout(() => {
                setOriginRect(null);
            }, 1000); // Clear after transition
            return () => clearTimeout(timer);
        }
    }, [pathname]); // Clear when path changes (transition starts)

    return (
        <TransitionContext.Provider value={{ direction, originRect, setOriginRect }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    return useContext(TransitionContext);
}
