// Saved admin sign-in token. localStorage can be unavailable
// (private mode, blocked storage): then it lasts for this tab only.
const TOKEN_KEY = "vritta.admin.token";

const listeners = new Set<() => void>();
let memoryToken: string | null = null;

export function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return memoryToken;
  }
}

export function saveToken(token: string | null): void {
  memoryToken = token;

  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Kept in memoryToken instead.
  }

  listeners.forEach((listener) => listener());
}

// For useSyncExternalStore: notified on sign-in/out here and in other tabs.
export function subscribeToken(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
