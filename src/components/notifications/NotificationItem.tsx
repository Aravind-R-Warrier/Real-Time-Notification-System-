// src/components/notifications/NotificationItem.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNotifications } from "./useNotifications";
import type { Notification } from "../../types/notifications";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Trash2, 
  Eye, 
  EyeOff,
  Bell,
  ExternalLink,
  Clock
} from "lucide-react";

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { markRead, remove } = useNotifications();
  const [isHovered, setIsHovered] = useState(false);

  const getSeverityIcon = () => {
    switch (notification.severity) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = () => {
    switch (notification.severity) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const readClasses = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  const unreadClasses = "bg-gradient-to-r from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-blue-100 dark:border-gray-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 100 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative group rounded-xl border ${notification.read ? readClasses : unreadClasses} p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        !notification.read ? "ring-1 ring-blue-500/10" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      )}

      {/* Severity indicator */}
      <div className={`absolute right-3 top-3 p-2 rounded-lg ${getSeverityColor()}`}>
        {getSeverityIcon()}
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {notification.title}
                </h4>
                {!notification.read && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    New
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                {notification.message}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(notification.timestamp)}</span>
                </div>
                
                {notification.meta?.priority && (
                  <span className={`px-2 py-0.5 rounded-full ${
                    notification.meta.priority === 'high' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {notification.meta.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - appear on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700"
      >
        <button
          onClick={() => markRead(notification.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            notification.read
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          }`}
        >
          {notification.read ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Mark Unread
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Mark Read
            </>
          )}
        </button>

        <button
          onClick={() => remove(notification.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>

        <button
          onClick={() => alert("Opening notification details...")}
          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="View details"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}