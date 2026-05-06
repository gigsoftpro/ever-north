// src/adminStore.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { defaultContent, STORAGE_KEYS } from "./contentSchema";
import {
  apiLogin,
  apiMe,
  apiChangePassword,
  storeToken,
  clearToken,
  getStoredToken,
  isTokenExpired,
} from "./services/authApi";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // hydrating session

  /* ── Hydrate session on mount ──────────────────────────────────────────── */
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEYS.content);
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch {}
    }

    const token = getStoredToken();

    if (!token || isTokenExpired()) {
      clearToken();
      setAuthLoading(false);
      return;
    }

    // Validate token with server
    apiMe()
      .then(({ admin }) => {
        setUser(admin);
        setIsLoggedIn(true);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setAuthLoading(false));
  }, []);

  /* ── Content ───────────────────────────────────────────────────────────── */
  const persistContent = useCallback((next) => {
    setContent(next);
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(next));
  }, []);

  const resetContent = useCallback(
    () => persistContent(defaultContent),
    [persistContent],
  );

  /* ── Auth ──────────────────────────────────────────────────────────────── */

  /**
   * login(identifier, password, rememberMe)
   * Returns { success, message }
   */
  const login = useCallback(
    async (identifier, password, rememberMe = false) => {
      try {
        const data = await apiLogin(identifier, password);

        storeToken(data.token, rememberMe);
        setUser(data.admin);
        setIsLoggedIn(true);

        return { success: true };
      } catch (err) {
        return { success: false, message: err.message || "Login failed" };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  /**
   * changePassword(currentPassword, newPassword)
   * Returns { success, message }
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await apiChangePassword(currentPassword, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Failed to update password",
      };
    }
  }, []);

  /**
   * Refresh user from server (useful after profile edits)
   */
  const refreshUser = useCallback(async () => {
    try {
      const { admin } = await apiMe();
      setUser(admin);
    } catch {
      logout();
    }
  }, [logout]);

  /* ── Context value ─────────────────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      // content
      content,
      persistContent,
      resetContent,
      // auth
      user,
      isLoggedIn,
      authLoading,
      login,
      logout,
      changePassword,
      refreshUser,
    }),
    [
      content,
      persistContent,
      resetContent,
      user,
      isLoggedIn,
      authLoading,
      login,
      logout,
      changePassword,
      refreshUser,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppStore = () => useContext(AppContext);
