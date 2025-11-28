'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SpringButton from '@/components/ui/SpringButton';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    href?: string;
    className?: string;
}

export default function BackButton({ href = '/', className }: BackButtonProps) {
    return (
        <Link href={href}>
            <SpringButton asChild>
                <div className={cn("p-2 hover:bg-accent rounded-full transition-colors cursor-pointer", className)}>
                    <ArrowLeft className="h-5 w-5" />
                </div>
            </SpringButton>
        </Link>
    );
}
