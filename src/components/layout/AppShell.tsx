// src/components/layout/AppShell.tsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import NotificationDrawer from "../notifications/NotificationDrawer";
import { NotificationsProvider } from "../notifications/NotificationsProvider";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <NotificationsProvider>
      <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Right side */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <Topbar onOpenNotifications={() => setDrawerOpen(true)} />

            {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </NotificationsProvider>
  );
}
