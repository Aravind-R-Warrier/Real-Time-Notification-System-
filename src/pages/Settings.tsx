import React, { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Card } from "../components/cards/Card";

/**
 * Settings Page
 * - Theme persists and is applied to document.documentElement
 * - Notification sound preview implemented via Web Audio API (no external file)
 * - useLocalStorage hook used for persistence
 */

type SettingsState = {
  theme: "light" | "dark";
  enableNotifications: boolean;
  playSound: boolean;
  compactMode: boolean;
};

const DEFAULTS: SettingsState = {
  theme: "light",
  enableNotifications: true,
  playSound: true,
  compactMode: false,
};

/**
 * small WebAudio beep for preview/notifications
 */
function playBeep(duration = 0.12, frequency = 880, type: OscillatorType = "sine") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = frequency;
    o.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.stop(now + duration + 0.02);

    // close context after sound finished (good for iOS / mobile)
    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, (duration + 0.1) * 1000);
  } catch (e) {
    // fallback: no audio available
    console.warn("WebAudio not available", e);
  }
}

export default function Settings() {
  const [state, setState] = useLocalStorage<SettingsState>("app.settings.v1", DEFAULTS);
  // UI-only transient flag to show preview played
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewTimerRef = useRef<number | null>(null);

  // apply theme on mount and whenever state.theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.theme]);

  // helper to toggle boolean keys
  function toggle<K extends keyof SettingsState>(key: K) {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setTheme(theme: SettingsState["theme"]) {
    setState((prev) => ({ ...prev, theme }));
    // effect will apply the class; keep immediate UX in sync
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  function resetDefaults() {
    setState(DEFAULTS);
    document.documentElement.classList.remove("dark");
  }

  // Play notification preview (observes enableNotifications + playSound)
  function handlePlayPreview() {
    if (!state.enableNotifications) {
      // small user feedback: can't play because notifications disabled
      setPreviewPlaying(true);
      window.setTimeout(() => setPreviewPlaying(false), 800);
      return;
    }

    if (state.playSound) {
      setPreviewPlaying(true);
      playBeep(0.14, 880, "sine");
      // stop preview flag after short interval
      if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
      previewTimerRef.current = window.setTimeout(() => setPreviewPlaying(false), 300);
    } else {
      // if sound disabled, do a visual flash
      setPreviewPlaying(true);
      if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
      previewTimerRef.current = window.setTimeout(() => setPreviewPlaying(false), 300);
    }
  }

  // Cleanup timers when unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Customize application preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Appearance">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-gray-500">Switch between light and dark</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme("light")}
                  aria-pressed={state.theme === "light"}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    state.theme === "light" ? "bg-gray-100" : "bg-transparent"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  aria-pressed={state.theme === "dark"}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    state.theme === "dark" ? "bg-gray-800 text-white" : "bg-transparent"
                  }`}
                >
                  Dark
                </button>
                <div className="ml-3 text-sm text-gray-500">
                  {state.theme === "dark" ? "Dark mode active" : "Light mode"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compact Mode</div>
                <div className="text-sm text-gray-500">Reduce spacing for dense content</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.compactMode}
                  onChange={() => toggle("compactMode")}
                  className="h-4 w-4"
                />
              </label>
            </div>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Notifications</div>
                <div className="text-sm text-gray-500">Receive notifications from the app</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.enableNotifications}
                  onChange={() => toggle("enableNotifications")}
                  className="h-4 w-4"
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Play Sound</div>
                <div className="text-sm text-gray-500">Play sound when notification arrives</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.playSound}
                  onChange={() => toggle("playSound")}
                  className="h-4 w-4"
                />
              </label>
            </div>

            <div className="pt-2 border-t mt-2">
              <div className="text-sm text-gray-600 mb-2">Notification preview</div>
              <div className="p-3 rounded-md bg-gray-50 dark:bg-slate-800 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">N</div>
                  <div className="flex-1">
                    <div className="font-medium">Sample notification</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">This message simulates how notifications will appear.</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={handlePlayPreview}
                      className="px-3 py-1 rounded-md text-sm bg-indigo-600 text-white"
                      aria-label="Play notification preview"
                    >
                      Play preview
                    </button>
                    <div className={`text-xs ${previewPlaying ? "text-green-600" : "text-gray-400"}`}>
                      {previewPlaying ? "Previewing…" : state.enableNotifications ? (state.playSound ? "Sound enabled" : "Sound off") : "Notifications disabled"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            // In production you would call an API to save preferences server-side
            alert("Settings saved (local demo)");
          }}
        >
          Save Settings
        </Button>
        <Button variant="outline" onClick={() => resetDefaults()}>
          Reset Defaults
        </Button>
      </div>
    </div>
  );
}
