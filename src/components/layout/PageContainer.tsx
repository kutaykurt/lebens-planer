import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    width?: 'default' | 'narrow' | 'wide' | 'full';
}

export function PageContainer({ children, className, width = 'default' }: PageContainerProps) {
    const maxWidth = {
        narrow: 'max-w-2xl',
        default: 'max-w-5xl',
        wide: 'max-w-7xl',
        full: 'max-w-[1600px]'
    }[width];

    return (
        <main suppressHydrationWarning className={cn('min-h-screen pb-20 pt-14', className)}>
            <div suppressHydrationWarning className={cn(maxWidth, "mx-auto px-4 py-8 sm:px-6 lg:px-8")}>
                {children}
            </div>
        </main>
    );
}
