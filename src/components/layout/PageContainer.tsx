import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <main className={cn('min-h-screen pb-20 pt-14', className)}>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {children}
            </div>
        </main>
    );
}
