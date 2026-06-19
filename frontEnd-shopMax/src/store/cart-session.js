const CART_SESSION_STORAGE_KEY = "shopmax-cart-session";

export function getCartSessionToken() {
  return window.localStorage.getItem(CART_SESSION_STORAGE_KEY);
}

export function setCartSessionToken(sessionToken) {
  window.localStorage.setItem(CART_SESSION_STORAGE_KEY, sessionToken);
}

export function clearCartSessionToken() {
  window.localStorage.removeItem(CART_SESSION_STORAGE_KEY);
}

export async function ensureCartSession(api) {
  const existing = getCartSessionToken();

  if (existing) {
    return existing;
  }

  const sessionToken = await api.ensureCartSession();
  setCartSessionToken(sessionToken);
  return sessionToken;
}
