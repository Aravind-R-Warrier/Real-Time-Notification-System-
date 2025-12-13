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
      onClick={onClick}
      aria-label="Open notifications"
      className="
        relative p-2 rounded-md
        hover:bg-gray-100 dark:hover:bg-slate-700
        transition focus:outline-none
      "
    >
      <motion.div whileTap={{ scale: 0.9 }}>
        <Bell
          className="
            w-6 h-6
            text-gray-700
            dark:text-slate-200
          "
        />
      </motion.div>

      {unreadCount > 0 && (
        <Badge count={unreadCount} />
      )}
    </button>
  );
}
