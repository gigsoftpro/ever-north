import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent, STORAGE_KEYS } from "./contentSchema";

const defaultUser = {
  name: "Admin User",
  email: "admin@evernorth.com",
  password: "Admin@123",
};
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [user, setUser] = useState(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEYS.content);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    const savedSession = localStorage.getItem(STORAGE_KEYS.session);
    if (savedContent) setContent(JSON.parse(savedContent));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedSession)
      setIsLoggedIn(JSON.parse(savedSession).isLoggedIn === true);
  }, []);

  const persistContent = (next) => {
    setContent(next);
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(next));
  };

  const login = (email, password) => {
    const ok = email === user.email && password === user.password;
    if (!ok) return false;
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({ isLoggedIn: true, at: Date.now() }),
    );
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setIsLoggedIn(false);
  };

  const updateProfile = (nextUser) => {
    const merged = { ...user, ...nextUser };
    setUser(merged);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(merged));
  };

  const resetContent = () => persistContent(defaultContent);

  const value = useMemo(
    () => ({
      content,
      persistContent,
      resetContent,
      user,
      login,
      logout,
      isLoggedIn,
      updateProfile,
    }),
    [content, user, isLoggedIn],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppStore = () => useContext(AppContext);
