// src/components/layout/Topbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import NotificationBell from "../notifications/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
};

export default function Topbar({ onToggleSidebar, onOpenNotifications }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (menuRef.current?.contains(e.target as Node) || buttonRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="w-full sticky top-0 z-20 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none"
          aria-label="Open menu"
          onClick={() => onToggleSidebar && onToggleSidebar()}
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

      </div>

      <div className="flex items-center gap-3 relative">
        {/* notifications */}
        <div className="z-20 mr-2 mt-2">
          <NotificationBell onClick={() => onOpenNotifications && onOpenNotifications()} />
        </div>

        {/* profile */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-sm font-medium text-gray-800 dark:text-gray-100">
              A
            </div>
            <span className="hidden sm:inline-block text-sm text-gray-700 dark:text-gray-200">Aravind</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="origin-top-right right-0 absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 z-30"
                role="menu"
                aria-label="Profile menu"
              >
                <div className="py-1">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 ${isActive ? "font-semibold" : ""}`
                    }
                    onClick={() => setOpen(false)}
                    role="menuitem"
                  >
                    Settings
                  </NavLink>

                  <NavLink
                    to="/help"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 ${isActive ? "font-semibold" : ""}`
                    }
                    onClick={() => setOpen(false)}
                    role="menuitem"
                  >
                    Help Center
                  </NavLink>

                  <button
                    onClick={() => {
                      setOpen(false);
                      // placeholder: implement actual logout logic if needed
                      alert("Logged out (demo)");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
