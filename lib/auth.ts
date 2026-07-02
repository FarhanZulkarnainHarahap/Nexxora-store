import { User } from "@/types/user";
import { BASE_URL } from "@/lib/api";

const TOKEN_KEY = "nexxora_token";
const USER_KEY = "nexxora_user";
const ROLE_KEY = "nexxora_role";

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: User) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  setCookie(TOKEN_KEY, token, 60 * 60 * 24 * 7);
  setCookie(ROLE_KEY, user.role, 60 * 60 * 24 * 7);
  window.dispatchEvent(new Event("nexxora-auth-change"));
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const rawUser = window.localStorage.getItem(USER_KEY);
  return rawUser ? (JSON.parse(rawUser) as User) : null;
}

export function clearStoredAuth() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);
  window.dispatchEvent(new Event("nexxora-auth-change"));
}

export function getOAuthSignInUrl(provider: "google" | "tiktok") {
  return `${BASE_URL}/auth/signin/${provider}`;
}
