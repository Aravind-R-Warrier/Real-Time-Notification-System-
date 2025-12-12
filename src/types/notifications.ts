// src/types/notifications.ts
export type NotificationSeverity = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  severity?: NotificationSeverity;
  meta?: Record<string, unknown>;
};
