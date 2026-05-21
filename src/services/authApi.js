import { BaseUrl } from "../components/Config/BaseUrl";

const BASE = `${BaseUrl}auth`;

async function request(endpoint, options = {}) {
  const token = getStoredToken();

  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getStoredToken() {
  return (
    localStorage.getItem("en_token") ||
    sessionStorage.getItem("en_token") ||
    null
  );
}

export function storeToken(token, remember) {
  if (!remember) {
    localStorage.setItem("en_token", token);
    localStorage.setItem("en_remember", "false");
    localStorage.setItem("en_token_at", String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  } else if (remember) {
    localStorage.setItem("en_token", token);
    localStorage.setItem("en_remember", "true");
    localStorage.setItem("en_token_at", String(Date.now()));
  } else {
    sessionStorage.setItem("en_token", token);
    localStorage.removeItem("en_token");
    localStorage.removeItem("en_remember");
    localStorage.removeItem("en_token_at");
  }
}

export function clearToken() {
  localStorage.removeItem("en_token");
  localStorage.removeItem("en_remember");
  localStorage.removeItem("en_token_at");
  sessionStorage.removeItem("en_token");
}

export function isTokenExpired() {
  const remember = localStorage.getItem("en_remember");
  const at = localStorage.getItem("en_token_at");
  if (!remember || !at) return false;

  const EXPIRY_DAYS = remember === "false" ? 7 : 60;
  const THIRTY_DAYS = EXPIRY_DAYS * (24 * 60 * 60 * 1000);
  
  return Date.now() - Number(at) > THIRTY_DAYS;
}

export async function apiLogin(identifier, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username: identifier, password }),
  });
}

export async function apiMe() {
  return request("/me");
}

export async function apiChangePassword(currentPassword, newPassword) {
  return request("/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
