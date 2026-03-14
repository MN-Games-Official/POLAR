"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode
} from "react";
import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "@/types";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  email: string;
  username: string;
  password: string;
  full_name?: string;
};

type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "danger";
};

type ToastContextValue = {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const ToastContext = createContext<ToastContextValue | null>(null);

type AuthAction =
  | { type: "hydrate"; user: AuthUser | null }
  | { type: "set-user"; user: AuthUser | null }
  | { type: "set-loading"; value: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "hydrate":
      return { user: action.user, loading: false };
    case "set-user":
      return { ...state, user: action.user };
    case "set-loading":
      return { ...state, loading: action.value };
    default:
      return state;
  }
}

function ToastViewport() {
  const toastContext = useContext(ToastContext);

  if (!toastContext) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toastContext.toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel animate-slide-up rounded-3xl border border-white/10 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs text-slate-300">{toast.description}</p>
              ) : null}
            </div>
            <button
              aria-label="Dismiss toast"
              className="text-xs text-slate-400 hover:text-white"
              onClick={() => toastContext.removeToast(toast.id)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [authState, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  };

  const refreshProfile = async () => {
    try {
      const payload = await apiClient<{ user: AuthUser }>("/api/users/profile", {
        method: "GET"
      });
      dispatch({ type: "hydrate", user: payload.user });
    } catch {
      dispatch({ type: "hydrate", user: null });
    }
  };

  useEffect(() => {
    void refreshProfile();
  }, []);

  const authValue = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      async login(payload) {
        dispatch({ type: "set-loading", value: true });
        try {
          const response = await apiClient<{ user: AuthUser }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(payload)
          });
          dispatch({ type: "set-user", user: response.user });
          pushToast({
            title: "Signed in",
            description: `Welcome back, ${response.user.username}.`,
            tone: "success"
          });
        } finally {
          dispatch({ type: "set-loading", value: false });
        }
      },
      async signup(payload) {
        dispatch({ type: "set-loading", value: true });
        try {
          await apiClient("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(payload)
          });
          pushToast({
            title: "Account created",
            description: "Check your email to verify the account.",
            tone: "success"
          });
        } finally {
          dispatch({ type: "set-loading", value: false });
        }
      },
      async logout() {
        await apiClient("/api/auth/logout", { method: "POST" });
        dispatch({ type: "set-user", user: null });
      },
      async refreshProfile() {
        await refreshProfile();
      },
      setUser(user) {
        dispatch({ type: "set-user", user });
      }
    }),
    [authState]
  );

  const toastValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      pushToast,
      removeToast
    }),
    [toasts]
  );

  return (
    <ToastContext.Provider value={toastValue}>
      <AuthContext.Provider value={authValue}>
        {children}
        <ToastViewport />
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AppProviders.");
  return context;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToastContext must be used inside AppProviders.");
  return context;
}
