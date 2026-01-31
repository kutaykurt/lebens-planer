import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Generate a UUID v4
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Get current timestamp in ISO 8601 format
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Format date to YYYY-MM-DD (local time)
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
    return formatDate(new Date());
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date, days: number): Date {
    return addDays(date, -days);
}

/**
 * Check if a date is before today
 */
export function isBeforeToday(dateStr: string): boolean {
    const today = getToday();
    return dateStr < today;
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
    return dateStr === getToday();
}

/**
 * Check if a date is in the past
 */
export function isPast(dateStr: string): boolean {
    return dateStr < getToday();
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateStr: string): boolean {
    return dateStr > getToday();
}

/**
 * Get relative date label
 */
export function getRelativeDateLabel(dateStr: string): string {
    const today = getToday();
    const tomorrow = formatDate(addDays(new Date(), 1));
    const yesterday = formatDate(subtractDays(new Date(), 1));

    if (dateStr === today) return 'Heute';
    if (dateStr === tomorrow) return 'Morgen';
    if (dateStr === yesterday) return 'Gestern';

    const date = parseDate(dateStr);
    const diffDays = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 7) {
        return `In ${diffDays} Tagen`;
    }

    if (diffDays < 0 && diffDays >= -7) {
        return `Vor ${Math.abs(diffDays)} Tagen`;
    }

    // Full date
    return date.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
}

/**
 * Format date for display (e.g., "Freitag, 31. Januar 2026")
 */
export function formatDateLong(date: Date): string {
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format date short (e.g., "31. Jan")
 */
export function formatDateShort(date: Date): string {
    return date.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'short',
    });
}

/**
 * Get the start of the week (Monday)
 */
export function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

/**
 * Get the end of the week (Sunday)
 */
export function getWeekEnd(date: Date): Date {
    const start = getWeekStart(date);
    return addDays(start, 6);
}

/**
 * Get the start of the month
 */
export function getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the end of the month
 */
export function getMonthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
    return date.getDay();
}

/**
 * Get weekday name
 */
export function getWeekdayName(dayIndex: number, format: 'short' | 'long' = 'short'): string {
    const days = format === 'short'
        ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return days[dayIndex];
}

/**
 * Get month name
 */
export function getMonthName(monthIndex: number, format: 'short' | 'long' = 'long'): string {
    const months = format === 'short'
        ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
        : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    // Handle 1-based index if likely passed from getMonth() + 1, but usually getMonth() is 0-based. 
    // The previous code in ReviewPage used parseInt(reflection.month.split('-')[1]) which is 1-based ('01' -> 1).
    // So we should expect 1-based or handle it. 
    // Let's assume 0-based to match standard JS Date.getMonth(), but be robust.
    // Actually, let's stick to 0-based and adjust in the caller if needed.
    // Wait, the caller is `getMonthName(parseInt(reflection.month.split('-')[1]))`. '01' is January.
    // So if I pass 1, I want January. 
    // Standard getMonth() returns 0 for January.
    // I should document this function expects 0-based or 1-based.
    // Common sense utility: usually 0-11.
    // But since my caller passes 1 for Jan, I should either subtract 1 there or here.
    // Let's make it 0-based index (0=Jan) conform to Date.
    return months[monthIndex];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Check if in private/incognito mode
 */
export async function isPrivateMode(): Promise<boolean> {
    if (!isBrowser()) return false;

    try {
        const storage = window.localStorage;
        const testKey = '__private_mode_test__';
        storage.setItem(testKey, 'test');
        storage.removeItem(testKey);
        return false;
    } catch {
        return true;
    }
}

/**
 * Download data as file
 */
export function downloadFile(data: string, filename: string, type: string = 'application/json'): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Get next occurrence date string
 */
export function getNextOccurrence(dateStr: string | null, recurrence: 'daily' | 'weekly' | 'monthly' | 'none'): string | null {
    if (!dateStr || recurrence === 'none') return null;
    const date = parseDate(dateStr);
    if (recurrence === 'daily') date.setDate(date.getDate() + 1);
    if (recurrence === 'weekly') date.setDate(date.getDate() + 7);
    if (recurrence === 'monthly') date.setMonth(date.getMonth() + 1);
    return formatDate(date);
}
