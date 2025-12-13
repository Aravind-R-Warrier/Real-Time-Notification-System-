// src/hooks/useSettings.tsx
import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Settings shape
 */
export type Settings = {
  theme: "light" | "dark" | "system";
  enableNotifications: boolean;
  playSound: boolean;
  soundVolume: number; // 0 - 100
  layoutDensity: "comfortable" | "compact";
  sidebarCollapsed: boolean;
};

const defaultSettings: Settings = {
  theme: "system",
  enableNotifications: true,
  playSound: true,
  soundVolume: 70,
  layoutDensity: "comfortable",
  sidebarCollapsed: false,
};

type SettingsContextValue = {
  settings: Settings;
  // partial update
  updateSettings: (v: Partial<Settings>) => void;
  // reset to defaults
  resetSettings: () => void;
  // returns 'light' | 'dark' as actually applied (resolves 'system')
  getAppliedTheme: () => "light" | "dark";
  // set theme to light/dark/system explicitly
  setTheme: (t: Settings["theme"]) => void;
  // toggle between light/dark (keeps 'system' => becomes explicit)
  toggleTheme: () => void;
  // set sound volume 0-100
  setSoundVolume: (v: number) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

/**
 * SettingsProvider
 * - persists settings to localStorage via useLocalStorage
 * - applies `dark` class to document.documentElement (SSR-safe)
 * - listens to system theme changes when theme === 'system'
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>("saas.settings.v1", defaultSettings);

  const hasWindow = typeof window !== "undefined" && typeof document !== "undefined";

  // Determine applied theme (resolves 'system' to light/dark)
  const getAppliedTheme = useCallback((): "light" | "dark" => {
    if (!hasWindow) {
      // during SSR fallback to light to avoid flashing
      return settings.theme === "dark" ? "dark" : "light";
    }
    if (settings.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return settings.theme === "dark" ? "dark" : "light";
  }, [settings.theme, hasWindow]);

  // Apply theme class when relevant state changes
  useEffect(() => {
    if (!hasWindow) return;
    const applied = getAppliedTheme();
    document.documentElement.classList.toggle("dark", applied === "dark");
  }, [getAppliedTheme, hasWindow]);

  // Listen to system preference changes when theme === 'system'
  useEffect(() => {
    if (!hasWindow) return;
    if (settings.theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.classList.toggle("dark", mq.matches);
    };

    // initialize
    handler();

    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      // Safari fallback
      // @ts-ignore
      mq.addListener && mq.addListener(handler);
      return () => {
        // @ts-ignore
        mq.removeListener && mq.removeListener(handler);
      };
    }
  }, [settings.theme, hasWindow]);

  // Update settings (partial)
  const updateSettings = useCallback((u: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...u }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  const setTheme = useCallback((t: Settings["theme"]) => {
    setSettings((p) => ({ ...p, theme: t }));
  }, [setSettings]);

  const toggleTheme = useCallback(() => {
    setSettings((p) => {
      // explicit toggle: if 'system' -> treat as light -> toggle to dark
      const current = p.theme === "system" ? (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p.theme;
      const next = current === "dark" ? "light" : "dark";
      return { ...p, theme: next };
    });
  }, [setSettings]);

  const setSoundVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    setSettings((p) => ({ ...p, soundVolume: clamped }));
  }, [setSettings]);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    updateSettings,
    resetSettings,
    getAppliedTheme,
    setTheme,
    toggleTheme,
    setSoundVolume,
  }), [settings, updateSettings, resetSettings, getAppliedTheme, setTheme, toggleTheme, setSoundVolume]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

/**
 * useSettings hook (consumer)
 */
export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
};
