"use client";

import axios, { AxiosError, AxiosInstance, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/auth-store";

const baseURL = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api").replace(/\/+$/, "");
const refreshPath = "/accounts/user/refresh/";

type RetryConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

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
  withCredentials: false,
  timeout: 30000,
});

// Attach access token
axiosInstance.interceptors.request.use((config) => {
  const access = useAuthStore.getState().getAccess();
  if (access) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

async function performRefresh(): Promise<string | null> {
  const { getRefresh, setTokens, logout, markRefreshing } = useAuthStore.getState();
  const refresh = getRefresh();
  if (!refresh) return null;

  markRefreshing(true);
  try {
    const res = await axios.post(
      `${baseURL}${refreshPath}`,
      { refresh },
      { timeout: 15000 }
    );

    const newAccess: string | undefined = res.data?.access;
    const newRefresh: string | undefined = res.data?.refresh;

    if (!newAccess) {
      logout();
      return null;
    }

    setTokens({ access: newAccess, refresh: newRefresh ?? refresh });
    return newAccess;
  } catch {
    logout();
    return null;
  } finally {
    markRefreshing(false);
  }
}

axiosInstance.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = (error.config ?? {}) as RetryConfig;

    if (!error.response || error.response.status !== 401) return Promise.reject(error);

    const url = original.url ?? "";
    const isAuthPath =
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/refresh");

    if (isAuthPath) return Promise.reject(error);
    if (original._retry) return Promise.reject(error);

    original._retry = true;

    if (useAuthStore.getState().isRefreshing || refreshPromise) {
      return new Promise((resolve, reject) => {
        addSubscriber((newToken) => {
          if (!newToken) return reject(error);
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(original));
        });
      });
    }

    refreshPromise = performRefresh();

    const newToken = await refreshPromise;
    refreshPromise = null;
    onRefreshed(newToken);

    if (!newToken) return Promise.reject(error);

    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newToken}`;
    return axiosInstance(original);
  }
);

export default axiosInstance;
