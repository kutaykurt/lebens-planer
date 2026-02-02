'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
    label?: string;
    onValueChange?: (value: number[]) => void;
    value?: number[];
    defaultValue?: number[];
    min?: number;
    max?: number;
    step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, onValueChange, value, defaultValue, min = 0, max = 100, step = 1, ...props }, ref) => {
        const val = value ? value[0] : (defaultValue ? defaultValue[0] : 0);
        const percentage = ((val - min) / (max - min)) * 100;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseInt(e.target.value, 10);
            if (onValueChange) {
                onValueChange([newValue]);
            }
        };

        return (
            <div className="w-full space-y-4">
                {label && (
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] block">
                        {label}
                    </label>
                )}
                <div className="relative h-6 flex items-center group">
                    {/* Track Background */}
                    <div className="absolute w-full h-1.5 bg-[var(--background-elevated)] rounded-full overflow-hidden shadow-inner border border-white/5">
                        {/* Active Track */}
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Invisible Range Input for functionality */}
                    <input
                        type="range"
                        ref={ref}
                        min={min}
                        max={max}
                        step={step}
                        value={val}
                        onChange={handleChange}
                        className={cn(
                            "absolute w-full h-full opacity-0 cursor-pointer z-20",
                            className
                        )}
                        {...props}
                    />

                    {/* Visual Thumb */}
                    <div
                        className="absolute w-6 h-6 rounded-xl bg-white shadow-xl border-2 border-indigo-500 z-10 pointer-events-none transition-all duration-300 group-hover:scale-110 group-active:scale-95"
                        style={{ left: `calc(${percentage}% - 12px)` }}
                    >
                        <div className="absolute inset-1 rounded-lg bg-indigo-500/10" />
                    </div>

                    {/* Micro-glow for thumb */}
                    <div
                        className="absolute w-12 h-12 rounded-full bg-indigo-500/20 blur-xl z-0 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ left: `calc(${percentage}% - 24px)` }}
                    />
                </div>
            </div>
        );
    }
);

Slider.displayName = 'Slider';
