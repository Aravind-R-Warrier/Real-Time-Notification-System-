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

    // Generate notification every 1 minute
    this.intervalId = setInterval(() => {
      const n = this.generate();
      this.listeners.forEach((cb) => cb(n));
    }, 60_000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.seeded = false;
  }

  generate(): Notification {
    const now = new Date().toISOString();

    return {
      id: uuid(),
      title: [
        "New Message",
        "Payment Received",
        "Server Warning",
        "Task Completed",
      ][Math.floor(Math.random() * 4)],
      message: "This is a simulated notification at " + new Date().toLocaleTimeString(),
      timestamp: now,
      read: false,
      severity: ["info", "success", "warning", "error"][
        Math.floor(Math.random() * 4)
      ] as Notification["severity"],
    };
  }

  // ⛔ No initial notifications after refresh
  fetchInitial(): Notification[] {
    return [];
  }
}

export const mockNotificationService = new MockNotificationService();
