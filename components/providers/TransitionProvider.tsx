'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type TransitionDirection = 'forward' | 'back' | null;

interface TransitionContextType {
    direction: TransitionDirection;
}

const TransitionContext = createContext<TransitionContextType>({ direction: null });

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [history, setHistory] = useState<string[]>([]);
    const [direction, setDirection] = useState<TransitionDirection>(null);

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
        } else if (currentPath !== history[history.length - 1]) {
            // Forward navigation
            setDirection('forward');
            setHistory((prev) => [...prev, currentPath]);
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TransitionContext.Provider value={{ direction }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    return useContext(TransitionContext);
}
