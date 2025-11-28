'use client'

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    aria-label="検索を開く"
                >
                    <Search className="h-5 w-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="fixed top-0 left-0 translate-x-0 translate-y-0 w-full max-w-full h-14 p-0 border-b rounded-none bg-background shadow-none data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 gap-0">
                <div className="flex items-center w-full h-full px-4 gap-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <form onSubmit={handleSubmit} className="flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="検索..."
                            className="w-full bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground h-full"
                            autoFocus
                        />
                    </form>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 whitespace-nowrap"
                    >
                        キャンセル
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
