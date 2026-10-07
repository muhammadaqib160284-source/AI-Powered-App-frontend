import { useSyncExternalStore } from "react";
import { DEV_SESSION } from "@/config/devSession";

const CONTEXT_KEY = "candor.activeContext";
const PERSONAL = { type: "personal" };

function loadContext() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONTEXT_KEY));
    if (saved?.type === "organization" && DEV_SESSION.memberships.some((m) => m.tenantId === saved.tenantId)) return saved;
  } catch {
    /* ignore malformed storage */
  }
  return PERSONAL;
}

let state = {
  accessToken: DEV_SESSION.accessToken,
  user: DEV_SESSION.user,
  memberships: DEV_SESSION.memberships,
  activeContext: loadContext(),
};
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}

export const sessionStore = {
  getState: () => state,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  // Called by the future login/refresh flow.
  setSession({ accessToken, user, memberships }) {
    setState({ accessToken, user: user ?? state.user, memberships: memberships ?? state.memberships });
  },
  setAccessToken(accessToken) {
    setState({ accessToken });
  },
  setActiveContext(ctx) {
    const same = ctx.type === state.activeContext.type && ctx.tenantId === state.activeContext.tenantId;
    if (same) return;
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
    setState({ activeContext: ctx });
  },
};

export const getActiveTenantId = () =>
  state.activeContext.type === "organization" ? state.activeContext.tenantId : null;

export function useSession() {
  const s = useSyncExternalStore(sessionStore.subscribe, sessionStore.getState);
  const activeMembership =
    s.activeContext.type === "organization"
      ? s.memberships.find((m) => m.tenantId === s.activeContext.tenantId) ?? null
      : null;
  return { ...s, activeMembership };
}
