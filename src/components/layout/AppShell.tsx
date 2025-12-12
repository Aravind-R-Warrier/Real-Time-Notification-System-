import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import NotificationDrawer from "../notifications/NotificationDrawer";
import { NotificationsProvider } from "../notifications/NotificationsProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar onOpenNotifications={() => setDrawerOpen(true)} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </NotificationsProvider>
  );
}
