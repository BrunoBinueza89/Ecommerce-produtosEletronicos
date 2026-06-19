const AUTH_STORAGE_KEY = "shopmax-admin-auth-session";

export function getAdminSession() {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
