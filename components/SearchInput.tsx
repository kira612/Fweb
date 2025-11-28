'use client'

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="検索を開く"
            >
                <Search className="h-5 w-5" />
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Bar Overlay */}
            <div className="absolute top-0 left-0 w-full h-14 z-50 bg-background border-b flex items-center px-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Search className="h-5 w-5 text-muted-foreground" />
                <form onSubmit={handleSubmit} className="flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="検索..."
                        className="w-full bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground"
                    />
                </form>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground px-2"
                >
                    キャンセル
                </button>
            </div>
        </>
    );
}
