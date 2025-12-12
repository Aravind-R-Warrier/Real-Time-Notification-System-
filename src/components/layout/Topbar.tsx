import React from "react";
import NotificationBell from "../notifications/NotificationBell";

/**
 * Topbar
 * - Shows title, optional hamburger for mobile to toggle sidebar
 * - Exposes handlers:
 *    onToggleSidebar: called when hamburger clicked (for small screens)
 *    onOpenNotifications: open the notifications drawer
 */

type Props = {
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
};

export default function Topbar({ onToggleSidebar, onOpenNotifications }: Props) {
  return (
    <header className="w-full sticky top-0 z-  border-b bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          aria-label="Open menu"
          onClick={() => onToggleSidebar && onToggleSidebar()}
        >
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-semibold leading-none">Dashboard</h1>
          <div className="text-xs text-gray-500">Overview & insights</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
      
        {/* notifications */}
        <NotificationBell onClick={() => onOpenNotifications && onOpenNotifications()} />

        {/* profile */}
        <div className="ml-2">
          <button className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-50 focus:outline-none" aria-haspopup="true" aria-expanded="false">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">A</div>
            <span className="hidden sm:inline-block text-sm text-gray-700">Aravind</span>
          </button>
        </div>
      </div>
    </header>
  );
}
