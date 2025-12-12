import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "./useNotifications";
import NotificationItem from "./NotificationItem";
import Button from "../ui/Button";
import EmptyState from "../common/EmptyState";

export default function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, unreadCount, markAllRead } = useNotifications();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{unreadCount} unread</span>
                <Button size="sm" onClick={markAllRead}>Mark all read</Button>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>
            </div>

            <div className="overflow-auto h-[calc(100%-64px)] space-y-2">
              {items.length === 0 && <EmptyState message="No notifications yet" />}
              {items.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
