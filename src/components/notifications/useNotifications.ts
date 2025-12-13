// src/components/notifications/useNotifications.ts
import { useNotificationsContext } from "./NotificationsProvider";

export function useNotifications() {
  const context = useNotificationsContext();
  
  // Add additional helper functions
  const markAsReadAndRemove = (id: string) => {
    context.markRead(id);
    setTimeout(() => context.remove(id), 300); // Small delay for animation
  };

  const getNotificationsBySeverity = (severity: string) => {
    return context.items.filter(item => item.severity === severity);
  };

  const getRecentNotifications = (hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return context.items.filter(item => new Date(item.timestamp) > cutoff);
  };

  return {
    ...context,
    markAsReadAndRemove,
    getNotificationsBySeverity,
    getRecentNotifications,
  };
}