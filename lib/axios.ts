// lib/axios.ts
"use client";

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/auth-store";

const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/";

// Queue to replay requests while a refresh is in-flight
let refreshPromise: Promise<string | null> | null = null;
type Subscriber = (token: string | null) => void;
const subscribers: Subscriber[] = [];

function onRefreshed(token: string | null) {
  subscribers.forEach((cb) => cb(token));
  subscribers.length = 0;
}

function addSubscriber(cb: Subscriber) {
  subscribers.push(cb);
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false, // set true only if backend uses cookies + CORS properly
  timeout: 30000,
});

// Attach Authorization header if we have an access token
axiosInstance.interceptors.request.use((config) => {
  const access = useAuthStore.getState().getAccess();
  if (access && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Helper: Perform refresh using the refresh token
async function performRefresh(): Promise<string | null> {
  const { getRefresh, setTokens, logout, markRefreshing } = useAuthStore.getState();
  const refresh = getRefresh();

  if (!refresh) return null;

  markRefreshing(true);
  try {
    // Correct DRF SimpleJWT refresh endpoint
    const res = await axios.post(
      `${baseURL}/token/refresh/`,
      { refresh },
      { timeout: 15000 }
    );

    // Expecting { access: string, refresh?: string }
    const newAccess: string | undefined = res.data?.access;
    const newRefresh: string | undefined = res.data?.refresh;

    if (!newAccess) {
      logout();
      return null;
    }

    setTokens({
      access: newAccess,
      refresh: newRefresh ?? refresh,
    });

    return newAccess;
  } catch {
    logout();
    return null;
  } finally {
    markRefreshing(false);
  }
}


// 401 handler with replay logic
axiosInstance.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If no response or not 401 → bubble up
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid retrying login/refresh endpoints to prevent loops
    const url = original?.url ?? "";
    const isAuthPath =
        url.includes("/login") ||
        url.includes("/signup") ||
        url.includes("/token") ||
        url.includes("/token/refresh");
    if (isAuthPath) {
      return Promise.reject(error);
    }

    // Prevent multiple retries on the same request
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    // If a refresh is already in-flight, subscribe and replay when done
    if (useAuthStore.getState().isRefreshing || refreshPromise) {
      return new Promise((resolve, reject) => {
        addSubscriber((newToken) => {
          if (!newToken) return reject(error);
          if (!original.headers) original.headers = {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(original));
        });
      });
    }

    // Start a new refresh and share its promise
    refreshPromise = performRefresh();

    try {
      const newToken = await refreshPromise;
      refreshPromise = null;
      onRefreshed(newToken);

      if (!newToken) {
        // refresh failed → logout already done in performRefresh
        return Promise.reject(error);
      }

      // Replay original request with new token
      if (!original.headers) original.headers = {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (e) {
      refreshPromise = null;
      onRefreshed(null);
      return Promise.reject(e);
    }
  }
);

export default axiosInstance;
