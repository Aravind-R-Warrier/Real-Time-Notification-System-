import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "./useNotifications";

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { markRead, remove } = useNotifications();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`p-3 rounded-md border ${notification.read ? "bg-white" : "bg-slate-50"} flex justify-between`}
    >
      <div onClick={() => markRead(notification.id)} className="cursor-pointer">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{notification.title}</p>
              <span className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          </div>
        </div>
      </div>
      <div className="ml-3 flex flex-col gap-2 items-end">
        <button onClick={() => remove(notification.id)} className="text-xs text-red-500">Delete</button>
      </div>
    </motion.div>
  );
}
