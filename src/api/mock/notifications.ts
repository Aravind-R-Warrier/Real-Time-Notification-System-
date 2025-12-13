// src/api/mock/notifications.ts
import { v4 as uuid } from "uuid";
import type { Notification } from "../../types/notifications";

type Callback = (n: Notification) => void;

class MockNotificationService {
  private listeners = new Set<Callback>();
  private intervalId?: ReturnType<typeof setInterval>;
  private seeded = false;

  subscribe(cb: Callback) {
    this.listeners.add(cb);
    if (!this.intervalId) this.start();
  }

  unsubscribe(cb: Callback) {
    this.listeners.delete(cb);
    if (this.listeners.size === 0) this.stop();
  }

  start() {
    if (this.seeded) return;
    this.seeded = true;

    // Generate SaaS notifications every 30-90 seconds
    this.intervalId = setInterval(() => {
      const n = this.generate();
      this.listeners.forEach((cb) => cb(n));
    }, 30000 + Math.random() * 60000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.seeded = false;
  }

  generate(): Notification {
    const now = new Date().toISOString();
    const saasEvents = [
      {
        title: "New User Signed Up",
        message: "Alex Chen just signed up for the Pro plan",
        severity: "success" as const
      },
      {
        title: "Payment Failed",
        message: "Payment processing failed for user #12345 - Retry required",
        severity: "error" as const
      },
      {
        title: "Server Alert",
        message: "High latency detected in US-East region",
        severity: "warning" as const
      },
      {
        title: "Subscription Renewed",
        message: "Annual subscription renewed for Maria Garcia",
        severity: "success" as const
      },
      {
        title: "API Rate Limit",
        message: "API rate limit exceeded for client ID: CL_78910",
        severity: "warning" as const
      },
      {
        title: "Feature Launch",
        message: "New analytics dashboard feature is now live",
        severity: "info" as const
      }
    ];

    const event = saasEvents[Math.floor(Math.random() * saasEvents.length)];
    
    return {
      id: uuid(),
      title: event.title,
      message: event.message,
      timestamp: now,
      read: false,
      severity: event.severity,
      meta: {
        priority: event.severity === "error" ? "high" : "medium"
      }
    };
  }

  // Initial SaaS notifications
  fetchInitial(count: number = 4): Notification[] {
    const notifications: Notification[] = [];
    const baseTime = Date.now();
    
    for (let i = 0; i < count; i++) {
      notifications.push({
        id: uuid(),
        title: ["System Update", "User Feedback", "Maintenance Scheduled", "New Integration"][i],
        message: [
          "System update completed successfully",
          "New user feedback received for dashboard",
          "Maintenance scheduled for Saturday 2AM UTC",
          "Slack integration is now available"
        ][i],
        timestamp: new Date(baseTime - (i * 3600000)).toISOString(),
        read: i > 1,
        severity: ["success", "info", "warning", "success"][i] as Notification["severity"]
      });
    }
    
    return notifications;
  }
}

export const mockNotificationService = new MockNotificationService();