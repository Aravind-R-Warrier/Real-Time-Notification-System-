// src/components/notifications/NotificationsProvider.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Notification } from "../../types/notifications";
import { mockNotificationService } from "../../api/mock/notifications";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type State = {
  items: Notification[];
};

type Action =
  | { type: "ADD"; payload: Notification }
  | { type: "MARK_READ"; payload: { id: string } }
  | { type: "MARK_ALL_READ" }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "SET"; payload: Notification[] };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      // prevent duplicates
      if (state.items.some((i) => i.id === action.payload.id)) return state;
      return { items: [action.payload, ...state.items] };
    case "MARK_READ":
      return { items: state.items.map((i) => (i.id === action.payload.id ? { ...i, read: true } : i)) };
    case "MARK_ALL_READ":
      return { items: state.items.map((i) => ({ ...i, read: true })) };
    case "DELETE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
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
};

const NotificationsContext = createContext<ContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // load persisted notifications from localStorage
  const [persisted, setPersisted] = useLocalStorage<Notification[]>("app.notifications.v1", []);

  // initialize reducer with persisted data
  const [state, dispatch] = useReducer(reducer, { items: persisted ?? initialState.items });

  // subscribe to mock service and bootstrap initial server-like notifications
  useEffect(() => {
    // fetch some initial simulated notifications and merge with persisted (persisted first so user-read items stay)
    const initial = mockNotificationService.fetchInitial(4);
    dispatch({ type: "SET", payload: [...initial, ...(persisted ?? [])] });

    const cb = (n: Notification) => dispatch({ type: "ADD", payload: n });
    mockNotificationService.subscribe(cb);
    return () => mockNotificationService.unsubscribe(cb);
    // intentionally depend on persisted only to run once when provider mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* no state dependency */]);

  // persist to localStorage when items change
  useEffect(() => {
    setPersisted(state.items);
  }, [state.items, setPersisted]);

  const unreadCount = state.items.reduce((c, i) => c + (i.read ? 0 : 1), 0);

  const value: ContextValue = {
    items: state.items,
    unreadCount,
    add: (n) => dispatch({ type: "ADD", payload: n }),
    markRead: (id) => dispatch({ type: "MARK_READ", payload: { id } }),
    markAllRead: () => dispatch({ type: "MARK_ALL_READ" }),
    remove: (id) => dispatch({ type: "DELETE", payload: { id } }),
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used inside NotificationsProvider");
  return ctx;
}
