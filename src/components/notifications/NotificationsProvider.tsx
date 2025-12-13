// src/components/notifications/NotificationsProvider.tsx
import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { Notification } from "../../types/notifications";
import { mockNotificationService } from "../../api/mock/notifications";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useSettings } from "../../hooks/useSettings";
import soundUrl from "../../utils/sound.wav";

type State = {
  items: Notification[];
};

type Action =
  | { type: "ADD"; payload: Notification }
  | { type: "MARK_READ"; payload: { id: string } }
  | { type: "MARK_ALL_READ" }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "DELETE_ALL" }
  | { type: "DELETE_READ" }
  | { type: "SET"; payload: Notification[] };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      if (state.items.some((i) => i.id === action.payload.id)) return state;
      return { items: [action.payload, ...state.items] };
    case "MARK_READ":
      return { items: state.items.map((i) => (i.id === action.payload.id ? { ...i, read: true } : i)) };
    case "MARK_ALL_READ":
      return { items: state.items.map((i) => ({ ...i, read: true })) };
    case "DELETE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "DELETE_ALL":
      return { items: [] };
    case "DELETE_READ":
      return { items: state.items.filter((i) => !i.read) };
    case "SET":
      return { items: action.payload };
    default:
      return state;
  }
}

type ContextValue = {
  items: Notification[];
  unreadCount: number;
  add: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  removeAll: () => void;
  removeRead: () => void;
  playTestSound: () => void;
};

const NotificationsContext = createContext<ContextValue | undefined>(undefined);

// WAV File Sound Manager
class WavSoundManager {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private playQueue: Array<{ volume: number; isTest?: boolean }> = [];

  async play(volume: number = 70, isTest: boolean = false) {
    this.playQueue.push({ volume, isTest });
    
    if (this.isPlaying) {
      return;
    }
    
    await this.processQueue();
  }

  private async processQueue() {
    if (this.playQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const { volume, isTest } = this.playQueue.shift()!;

    try {
      // Create audio element
      const audio = new Audio(soundUrl);
      audio.volume = Math.max(0.01, Math.min(1, volume / 100));
      audio.preload = "auto";
      
      audio.onended = () => {
        this.isPlaying = false;
        setTimeout(() => this.processQueue(), 100);
      };
      
      audio.onerror = (error) => {
        console.warn("Failed to play WAV sound:", error);
        this.isPlaying = false;
        
        // Fallback only for test sound
        if (isTest) {
          this.createFallbackTestSound(volume);
        }
        
        setTimeout(() => this.processQueue(), 100);
      };
      
      await audio.play();
    } catch (error) {
      console.warn("Audio playback failed:", error);
      this.isPlaying = false;
      
      // Fallback only for test sound
      if (isTest) {
        this.createFallbackTestSound(volume);
      }
      
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private createFallbackTestSound(volume: number) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(554.37, this.audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(659.25, this.audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.3);
      
      const gain = Math.max(0.01, Math.min(1, volume / 100));
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Fallback test sound failed:", error);
    }
  }

  async playTestSound(volume: number = 70) {
    await this.play(volume, true);
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.playQueue = [];
    this.isPlaying = false;
  }
}

// Create singleton sound manager
const soundManager = new WavSoundManager();

// Export the sound manager for use in Settings page
export const notificationSound = soundManager;

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useLocalStorage<Notification[]>("saas.notifications.v1", []);
  const [state, dispatch] = useReducer(reducer, { items: persisted ?? initialState.items });
  const { settings } = useSettings();
  
  // Track newly added notifications to play sound only for new ones
  const previousNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const initial = mockNotificationService.fetchInitial(1);
    const initialIds = new Set(initial.map(n => n.id));
    const persistedIds = new Set(persisted?.map(n => n.id) || []);
    
    // Combine both sets
    previousNotificationIds.current = new Set([...initialIds, ...persistedIds]);
    
    dispatch({ type: "SET", payload: [...initial, ...(persisted ?? [])] });

    const cb = (n: Notification) => {
      // Check if this is a truly new notification (not already in our state)
      const isNewNotification = !previousNotificationIds.current.has(n.id);
      
      dispatch({ type: "ADD", payload: n });
      previousNotificationIds.current.add(n.id);
      
      // Only play sound for new notifications when enabled
      if (isNewNotification && settings.enableNotifications && settings.playSound) {
        soundManager.play(settings.soundVolume);
        
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
        
        if ("Notification" in window && Notification.permission === "granted") {
          try {
            const notification = new Notification(n.title, {
              body: n.message,
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              tag: n.id,
              requireInteraction: false,
              silent: !settings.playSound,
            });

            setTimeout(() => notification.close(), 5000);

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          } catch (error) {
            console.warn("Desktop notification failed:", error);
          }
        }
      }
    };
    
    mockNotificationService.subscribe(cb);
    return () => mockNotificationService.unsubscribe(cb);
  }, [settings.enableNotifications, settings.playSound, settings.soundVolume]);

  useEffect(() => {
    return () => {
      soundManager.cleanup();
    };
  }, []);

  // Remove the useEffect that was checking unread count changes
  // This was causing duplicate sounds

  useEffect(() => {
    setPersisted(state.items);
  }, [state.items, setPersisted]);

  const unreadCount = state.items.reduce((c, i) => c + (i.read ? 0 : 1), 0);

  const playTestSound = () => {
    if (settings.enableNotifications && settings.playSound) {
      soundManager.playTestSound(settings.soundVolume);
    } else {
      alert("Please enable notifications and sound in settings first");
    }
  };

  const value: ContextValue = {
    items: state.items,
    unreadCount,
    add: (n) => dispatch({ type: "ADD", payload: n }),
    markRead: (id) => dispatch({ type: "MARK_READ", payload: { id } }),
    markAllRead: () => dispatch({ type: "MARK_ALL_READ" }),
    remove: (id) => dispatch({ type: "DELETE", payload: { id } }),
    removeAll: () => {
      if (window.confirm("Are you sure you want to delete all notifications?")) {
        dispatch({ type: "DELETE_ALL" });
      }
    },
    removeRead: () => dispatch({ type: "DELETE_READ" }),
    playTestSound,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used inside NotificationsProvider");
  return ctx;
}