import axios from 'axios';

/** Deployed API (used when VITE_API_URL is unset in production builds). */
const DEFAULT_PRODUCTION_API = 'https://smart-campus-transportation-system.onrender.com/api';

/** Local backend for `npm run dev` when .env has no VITE_API_URL */
const DEFAULT_DEV_API = 'http://127.0.0.1:5000/api';

/**
 * Ensures base URL ends with /api (matches Express mount prefix).
 * Accepts https://host or https://host/ or https://host/api
 */
export function normalizeApiBaseUrl(input) {
  const s = String(input || '').trim().replace(/\/+$/, '');
  if (!s) return DEFAULT_PRODUCTION_API;
  return s.endsWith('/api') ? s : `${s}/api`;
}

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return normalizeApiBaseUrl(fromEnv);
  if (import.meta.env.DEV) return DEFAULT_DEV_API;
  return DEFAULT_PRODUCTION_API;
}

export const apiBaseURL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
});

const TOKEN_KEY = 'token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = String(err.config?.url || '');
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthRoute && getStoredToken()) {
      setStoredToken(null);
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);
