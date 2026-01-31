'use client';

import { useEffect, useState } from 'react';
import { usePreferences, useHydration } from '@/stores';
import type { ThemeMode } from '@/types';

/**
 * Theme Provider - Applies the theme based on user preferences
 * Supports: light, dark, and system (auto-detect)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const preferences = usePreferences();
    const isHydrated = useHydration();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isHydrated) return;

        const applyAppearance = () => {
            const root = document.documentElement;
            const { theme, appearance } = preferences;

            // 1. Core Theme (Light/Dark/System)
            root.classList.remove('dark', 'light');
            if (theme === 'dark') root.classList.add('dark');
            else if (theme === 'light') root.classList.add('light');

            // 2. Theme Preset
            root.setAttribute('data-theme', appearance.themePreset);

            // 3. Compact Mode
            root.setAttribute('data-compact', appearance.compactMode.toString());

            // 4. Font Size
            root.setAttribute('data-font-size', appearance.fontSize);

            // 5. Custom Accent Color (only if no preset is active)
            if (appearance.themePreset === 'none') {
                root.style.setProperty('--accent-primary', appearance.accentColor);
                // Simple way to generate light version (transparent hex or rgba)
                root.style.setProperty('--accent-primary-light', `${appearance.accentColor}1a`);
                root.style.setProperty('--accent-primary-glow', `${appearance.accentColor}40`);
            } else {
                root.style.removeProperty('--accent-primary');
                root.style.removeProperty('--accent-primary-light');
                root.style.removeProperty('--accent-primary-glow');
            }
        };

        applyAppearance();

        // Listen for system theme changes if theme is 'system'
        if (preferences.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyAppearance();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [preferences.theme, preferences.appearance, mounted, isHydrated]);

    return <>{children}</>;
}
