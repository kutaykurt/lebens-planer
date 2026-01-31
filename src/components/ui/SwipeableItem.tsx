'use client';

import React, { useRef, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableItemProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    leftActionIcon?: React.ReactNode;
    rightActionIcon?: React.ReactNode;
    leftActionColor?: string; // e.g. "bg-emerald-500"
    rightActionColor?: string; // e.g. "bg-red-500"
    className?: string;
    threshold?: number;
}

export function SwipeableItem({
    children,
    onSwipeLeft,
    onSwipeRight,
    leftActionIcon = <Check className="w-6 h-6 text-white" />,
    rightActionIcon = <Trash2 className="w-6 h-6 text-white" />,
    leftActionColor = "bg-emerald-500",
    rightActionColor = "bg-red-500",
    className,
    threshold = 80 // px to trigger
}: SwipeableItemProps) {
    const controls = useAnimation();
    const [isDragging, setIsDragging] = useState(false);

    // We need to keep track of drag x to show background colors
    // But framer motion handles this better with z-index layering usually.
    // Simpler approach: Put backgrounds *behind* the item.

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        setIsDragging(false);

        if (onSwipeRight && offset > threshold) {
            // Swiped Right -> Action (usually Complete/Approve)
            await controls.start({ x: 200, opacity: 0 }); // Animate out
            onSwipeRight();
            // Reset effectively happens if the item is removed from DOM.
            // If not removed, we might need to reset:
            // await controls.start({ x: 0, opacity: 1 });
        } else if (onSwipeLeft && offset < -threshold) {
            // Swiped Left -> Action (usually Delete/Archive)
            await controls.start({ x: -200, opacity: 0 });
            onSwipeLeft();
        } else {
            // Reset
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={cn("relative overflow-hidden rounded-xl", className)}>
            {/* Background Actions Layer */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                {/* Left Action (Visible when swiping right) */}
                <div className={cn("h-full w-full flex items-center justify-start pl-6", leftActionColor)}>
                    {leftActionIcon}
                </div>

                {/* Right Action (Visible when swiping left) */}
                {/* Note: We essentially stack them. In a real complex swipe, we'd dynamically show only one based on direction. */}
                {/* For simplicity: We can use a gradient or just put the right action absolutely positioned to the right if we had complex collision logic. */}
                {/* Better: Put two divs, one aligned left, one right. */}
            </div>

            <div className={cn("absolute inset-0 flex items-center justify-end pr-6", rightActionColor)}>
                {rightActionIcon}
            </div>

            {/* Foreground Content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} // Constraints 0 makes it spring back, but dragElastic allows movement
                dragElastic={0.7} // Resistance
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative bg-[var(--background-surface)] z-10" // z-10 to stay on top
                whileTap={{ cursor: 'grabbing' }}
            >
                {children}
            </motion.div>
        </div>
    );
}

// NOTE: For 'dragConstraints={{ left: 0, right: 0 }}' to work as a spring-back,
// we rely on onDragEnd reset logic if threshold not met.
