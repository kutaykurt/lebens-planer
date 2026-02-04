/**
 * Notification Service for Lebensplaner
 * Handles browser notification permissions and sending local notifications.
 */

export const NotificationService = {
    /**
     * Check if notifications are supported in the current browser
     */
    isSupported: (): boolean => {
        return typeof window !== 'undefined' && 'Notification' in window;
    },

    /**
     * Get the current permission status
     */
    getPermission: (): NotificationPermission => {
        if (!NotificationService.isSupported()) return 'denied';
        return Notification.permission;
    },

    /**
     * Request notification permissions from the user
     */
    requestPermission: async (): Promise<NotificationPermission> => {
        if (!NotificationService.isSupported()) return 'denied';

        const permission = await Notification.requestPermission();
        return permission;
    },

    /**
     * Send a local notification
     */
    send: async (title: string, options?: NotificationOptions) => {
        if (!NotificationService.isSupported()) return;

        if (Notification.permission === 'granted') {
            // Register service worker if available for background notifications
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification(title, {
                    icon: '/icons/icon-192.svg',
                    badge: '/icons/icon-192.svg',
                    ...options
                });
            } else {
                // Fallback to simple Notification
                new Notification(title, options);
            }
        }
    }
};
