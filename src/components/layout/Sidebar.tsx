import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Reusable NavItem */
const NavItem: React.FC<{
  to: string;
  label: string;
  icon?: React.ReactNode;
  end?: boolean;
}> = ({ to, label, icon, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
          isActive
            ? "bg-gray-100 text-gray-900 font-semibold"
            : "text-gray-600 hover:bg-gray-50"
        }`
      }
      aria-current={(props: any) => (props.isActive ? "page" : undefined)}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </NavLink>
  );
};

/* Main responsive Sidebar component */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // focus drawer when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => drawerRef.current?.focus(), 50);
    }
  }, [open]);

  const DesktopSidebar = (
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 hidden lg:flex lg:flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-105">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NexusDash
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Enterprise Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-2" aria-label="Main navigation">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Main Menu
        </div>

        <NavItem
          to="/"
          end
          label="Dashboard"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <NavItem
          to="/analytics"
          label="Analytics"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M3 3v18h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 14l3-3 3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <NavItem
          to="/settings"
          label="Settings"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a1 1 0 010 1.41 1 1 0 01-1.41 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a1 1 0 01-2 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a1 1 0 01-1.41-1.41l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a1 1 0 110-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a1 1 0 111.41-1.41l.06.06a1.65 1.65 0 001.82.33H7a1.65 1.65 0 001-1.51V3a1 1 0 012 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a1 1 0 011.41 1.41l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a1 1 0 010 2h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          }
        />
      </nav>

      {/* Tools */}
      <div className="mt-8">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Tools
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem
            to="/help"
            label="Help Center"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M12 16v-1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 12.5v-.5a2 2 0 10-2-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      {DesktopSidebar}

      {/* Mobile hamburger */}
      <div className="fixed top-3 left-3 z-50 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-md bg-white shadow-md hover:shadow-lg focus:outline-none"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl p-4"
              ref={drawerRef}
              tabIndex={-1}
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="text-lg font-bold">NexusDash</div>
                    <div className="text-xs text-gray-500">Analytics</div>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-gray-100 transition focus:outline-none"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <nav
                className="flex flex-col gap-2"
                aria-label="Mobile navigation"
              >
                <NavItem
                  to="/"
                  end
                  label="Dashboard"
                  icon={<span className="w-5 h-5">{/* icon */}</span>}
                />
                <NavItem
                  to="/analytics"
                  label="Analytics"
                  icon={<span className="w-5 h-5" />}
                />
                <NavItem
                  to="/settings"
                  label="Settings"
                  icon={<span className="w-5 h-5" />}
                />
                <div className="mt-4 border-t pt-4">
                  <NavItem
                    to="/help"
                    label="Help Center"
                    icon={<span className="w-5 h-5" />}
                  />
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
