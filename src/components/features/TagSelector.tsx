import { cn } from '@/lib/utils';
import { useLifeOSStore } from '@/stores';

interface TagSelectorProps {
    selectedTagIds: string[];
    onToggle: (tagId: string) => void;
    className?: string;
}

export function TagSelector({
    selectedTagIds,
    onToggle,
    className
}: TagSelectorProps) {
    const tags = useLifeOSStore((s) => s.tags);

    if (!tags || tags.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-2 mt-2", className)}>
            {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => onToggle(tag.id)}
                        className={cn(
                            "px-2 py-1 rounded-md text-xs font-bold transition-all border",
                            isSelected
                                ? "bg-[var(--background-elevated)] border-[var(--accent-primary)] text-[var(--foreground)]"
                                : "bg-transparent border-transparent text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)]"
                        )}
                    >
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            />
                            {tag.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
