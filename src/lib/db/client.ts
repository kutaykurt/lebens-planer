import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

// ─── Database Schema ─────────────────────────────────────────────────────────

interface LifeOSDBSchema extends DBSchema {
    store: {
        key: string;
        value: unknown;
    };
}

const DB_NAME = 'life-os-db';
const DB_VERSION = 1;
const STORE_NAME = 'store';

let dbInstance: IDBPDatabase<LifeOSDBSchema> | null = null;

// ─── Check if running in browser ─────────────────────────────────────────────

function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

// ─── Database Initialization ─────────────────────────────────────────────────

async function getDB(): Promise<IDBPDatabase<LifeOSDBSchema> | null> {
    if (!isBrowser()) return null;

    if (dbInstance) return dbInstance;

    try {
        dbInstance = await openDB<LifeOSDBSchema>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
            blocked() {
                console.warn('Database blocked - please close other tabs');
            },
            blocking() {
                dbInstance?.close();
                dbInstance = null;
            },
            terminated() {
                dbInstance = null;
            },
        });

        return dbInstance;
    } catch (error) {
        console.error('Failed to open IndexedDB:', error);
        return null;
    }
}

// ─── Storage Operations ──────────────────────────────────────────────────────

export async function getItem<T>(key: string): Promise<T | null> {
    try {
        const db = await getDB();
        if (!db) return null;

        const value = await db.get(STORE_NAME, key);
        return (value as T) ?? null;
    } catch (error) {
        console.error('IndexedDB getItem error:', error);
        return null;
    }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
    try {
        const db = await getDB();
        if (!db) return;

        await db.put(STORE_NAME, value, key);
    } catch (error) {
        console.error('IndexedDB setItem error:', error);
        throw error;
    }
}

export async function removeItem(key: string): Promise<void> {
    try {
        const db = await getDB();
        if (!db) return;

        await db.delete(STORE_NAME, key);
    } catch (error) {
        console.error('IndexedDB removeItem error:', error);
        throw error;
    }
}

export async function clear(): Promise<void> {
    try {
        const db = await getDB();
        if (!db) return;

        await db.clear(STORE_NAME);
    } catch (error) {
        console.error('IndexedDB clear error:', error);
        throw error;
    }
}

// ─── Zustand Storage Adapter ─────────────────────────────────────────────────

export interface StateStorage {
    getItem: (name: string) => Promise<string | null>;
    setItem: (name: string, value: string) => Promise<void>;
    removeItem: (name: string) => Promise<void>;
}

export const indexedDBStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (!isBrowser()) return null;
        const value = await getItem<string>(name);
        return value;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        if (!isBrowser()) return;
        await setItem(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        if (!isBrowser()) return;
        await removeItem(name);
    },
};

// ─── Database Health Check ───────────────────────────────────────────────────

export async function checkDatabaseHealth(): Promise<{
    available: boolean;
    error?: string;
}> {
    if (!isBrowser()) {
        return { available: false, error: 'Not in browser environment' };
    }

    try {
        const db = await getDB();
        if (!db) {
            return { available: false, error: 'Failed to open database' };
        }

        const testKey = '__health_check__';
        await db.put(STORE_NAME, Date.now(), testKey);
        await db.delete(STORE_NAME, testKey);
        return { available: true };
    } catch (error) {
        return {
            available: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ─── Storage Quota Check ─────────────────────────────────────────────────────

export async function getStorageEstimate(): Promise<{
    used: number;
    available: number;
    percentUsed: number;
} | null> {
    if (!isBrowser()) return null;

    try {
        if ('storage' in navigator) {
            const estimate = await navigator.storage.estimate();
            const used = estimate.usage || 0;
            const available = estimate.quota || 0;
            const percentUsed = available > 0 ? (used / available) * 100 : 0;
            return { used, available, percentUsed };
        }
        return null;
    } catch {
        return null;
    }
}
