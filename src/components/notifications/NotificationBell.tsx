import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "./useNotifications";
import { Bell } from "lucide-react";
import Badge from "../ui/Badge";

type Props = {
  onClick: () => void;
};

export default function NotificationBell({ onClick }: Props) {
  const { unreadCount } = useNotifications();

  return (
    <button
      className="relative p-2 rounded-md hover:bg-gray-100 transition focus:outline-none"
      aria-label="Open notifications"
      onClick={onClick}
    >
      <motion.div whileTap={{ scale: 0.9 }}>
        <Bell className="w-6 h-6 text-gray-700" />
      </motion.div>

      {unreadCount > 0 && (
        <Badge count={unreadCount} />
      )}
    </button>
  );
}
