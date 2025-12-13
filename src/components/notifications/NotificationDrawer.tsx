// src/components/notifications/NotificationDrawer.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "./useNotifications";
import NotificationItem from "./NotificationItem";
import Button from "../ui/Button";
import EmptyState from "../common/EmptyState";
import { 
  Bell, 
  X, 
  CheckCircle, 
  Trash2, 
  Filter, 
  MoreVertical,
  Download,
  Settings
} from "lucide-react";

export default function NotificationDrawer({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void 
}) {
  const { items, unreadCount, markAllRead, removeAll, removeRead } = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const filteredItems = items.filter(item => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  const unreadItems = items.filter(item => !item.read);
  const readItems = items.filter(item => item.read);

  const handleDeleteAll = () => {
    if (window.confirm(`Are you sure you want to delete all ${items.length} notifications?`)) {
      removeAll();
    }
  };

  const handleExportNotifications = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notifications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Notifications exported successfully!");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.5 
            }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay updated with your activity
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {items.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {unreadCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Unread
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {readItems.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Read
                  </div>
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "all"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    All ({items.length})
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "unread"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter("read")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "read"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    Read ({readItems.length})
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {showMoreOptions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            markAllRead();
                            setShowMoreOptions(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark All as Read
                        </button>
                        <button
                          onClick={() => {
                            removeRead();
                            setShowMoreOptions(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Read
                        </button>
                        <button
                          onClick={() => {
                            handleExportNotifications();
                            setShowMoreOptions(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export JSON
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleDeleteAll}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete All
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredItems.length === 0 ? (
                <EmptyState
                  title={`No ${filter === "all" ? "" : filter} notifications`}
                  message={`You're all caught up! ${filter === "all" ? "No notifications to show." : `No ${filter} notifications found.`}`}
                  icon={<Bell className="w-12 h-12 text-gray-400" />}
                />
              ) : (
                filteredItems.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={markAllRead}
                  className="flex-1"
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                
                <Button
                  variant="danger"
                  onClick={handleDeleteAll}
                  className="flex-1"
                  disabled={items.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              </div>
              
              <div className="mt-3 text-center">
                <button
                  onClick={() => alert("Opening notification settings...")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"
                >
                  <Settings className="w-4 h-4" />
                  Notification Settings
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}