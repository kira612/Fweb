import { User } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
    avatarUrl?: string | null;
    displayName?: string | null;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function UserAvatar({
    avatarUrl,
    displayName,
    size = "md",
    className = "",
}: UserAvatarProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-24 w-24",
    };

    const iconSizes = {
        sm: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-14 w-14",
    };

    if (avatarUrl) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden border relative ${className}`}>
                <Image
                    src={avatarUrl}
                    alt={displayName || "User avatar"}
                    width={size === "lg" ? 96 : size === "md" ? 40 : 32}
                    height={size === "lg" ? 96 : size === "md" ? 40 : 32}
                    className="w-full h-full object-cover"
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center border ${className}`}>
            <User className={`${iconSizes[size]} text-muted-foreground`} style={{ pointerEvents: 'none' }} />
        </div>
    );
}
