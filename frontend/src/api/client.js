import axios from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT_MS, TENANT_HEADER } from "@/config/env";
import { getActiveTenantId, sessionStore } from "@/lib/session";
import { ApiError, toApiError } from "@/api/errors";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

const isOrganizationRoute = (url = "") => url.startsWith("/organization");

http.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    throw new ApiError({ kind: "config", message: "The API isn't configured yet. Set REACT_APP_API_BASE_URL." });
  }
  const { accessToken } = sessionStore.getState();
  if (accessToken && !config.skipAuth) config.headers.Authorization = `Bearer ${accessToken}`;

  if (isOrganizationRoute(config.url) && !config.skipTenant) {
    const tenantId = getActiveTenantId();
    if (!tenantId) throw new ApiError({ kind: "context", message: "Select an organization to continue." });
    config.headers[TENANT_HEADER] = tenantId;
  }
  return config;
});

let unauthorizedHandler = null;
// Hook for the future POST /refresh flow (retry or redirect to login).
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const apiError = toApiError(error);
    if (apiError.kind === "unauthorized") unauthorizedHandler?.(apiError);
    return Promise.reject(apiError);
  },
);

const send = (config) => http.request(config).then((res) => res.data);

export const api = {
  get: (url, config) => send({ ...config, method: "get", url }),
  post: (url, data, config) => send({ ...config, method: "post", url, data }),
  put: (url, data, config) => send({ ...config, method: "put", url, data }),
  delete: (url, data, config) => send({ ...config, method: "delete", url, data }),
  upload: (url, formData, { onProgress, signal, ...config } = {}) =>
    send({
      ...config,
      method: "post",
      url,
      data: formData,
      signal,
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    }),
};
