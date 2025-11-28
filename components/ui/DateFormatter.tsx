import { formatDistanceToNow, format } from "date-fns";
import { ja } from "date-fns/locale";

interface DateFormatterProps {
    date: string | Date;
    formatType?: 'relative' | 'absolute';
    className?: string;
}

export default function DateFormatter({ date, formatType = 'relative', className }: DateFormatterProps) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (formatType === 'absolute') {
        return (
            <span className={className}>
                {format(dateObj, 'yyyy/MM/dd', { locale: ja })}
            </span>
        );
    }

    return (
        <span className={className} suppressHydrationWarning>
            {formatDistanceToNow(dateObj, { addSuffix: true, locale: ja })}
        </span>
    );
}
