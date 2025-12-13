// src/pages/Settings.tsx
import React, { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import { Card } from "../components/cards/Card";
import {
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  LayoutGrid,
  Save,
  RotateCcw,
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useNotifications } from "../components/notifications/useNotifications";
import { motion } from "framer-motion";

export default function Settings() {
  const { settings, updateSettings, resetSettings, setTheme, setSoundVolume } =
    useSettings();
  const { playTestSound: playNotificationTestSound } = useNotifications();
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewTimerRef = useRef<number | null>(null);

  const handleSoundPreview = () => {
    if (!settings.enableNotifications) {
      alert("Enable notifications first to hear the sound");
      return;
    }

    setPreviewPlaying(true);
    playNotificationTestSound();

    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = window.setTimeout(
      () => setPreviewPlaying(false),
      800
    );
  };

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  // FIX: Prevent creating test notifications when changing volume
  const handleVolumeChange = (value: number) => {
    setSoundVolume(value);
    // Don't trigger any notification sound here
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your dashboard experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card title="Appearance" className="dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {settings.theme === "dark" ? (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Theme
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred theme
                  </div>
                </div>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <LayoutGrid className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Layout Density
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Control spacing and layout
                  </div>
                </div>
              </div>
              <select
                value={settings.layoutDensity}
                onChange={(e) =>
                  updateSettings({ layoutDensity: e.target.value as any })
                }
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications" className="dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Enable Notifications
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive real-time updates
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={() => toggleSetting("enableNotifications")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {settings.playSound ? (
                    <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Notification Sound
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Play sound for new notifications
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.playSound}
                  onChange={() => toggleSetting("playSound")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Sound Preview */}
      <Card title="Sound Preview" className="dark:border-gray-700">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Test Notification Sound
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Preview how notifications will sound when they arrive
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${
                    settings.playSound ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {settings.playSound ? "Sound enabled" : "Sound disabled"}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSoundPreview}
                variant="primary"
                disabled={!settings.enableNotifications}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Play Preview
              </Button>
              {/* REMOVED: Second button that was causing issues */}
            </div>
          </div>
          {previewPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Playing notification sound at {settings.soundVolume}% volume...
              </div>
            </motion.div>
          )}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            alert("Settings saved successfully!");
          }}
          className="
      flex items-center gap-2
      dark:bg-blue-600 dark:hover:bg-blue-700
      dark:text-white
    "
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            resetSettings();
            document.documentElement.classList.remove("dark");
          }}
          className="
      flex items-center gap-2
      dark:border-slate-600
      dark:text-slate-200
      dark:hover:bg-slate-700
    "
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
