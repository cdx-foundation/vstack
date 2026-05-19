// src/lib/storage.ts

/**
 * StorageAdapter Interface
 *
 * Defines the standard contract for preference persistence.
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * LocalStorageAdapter
 *
 * The default browser-based storage adapter.
 */
class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignored in limited CEF sandbox contexts
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignored
    }
  }
}

/**
 * MemoryStorageAdapter
 *
 * An in-memory fallback adapter for automated unit tests
 * or sandbox environments where localStorage is not writable.
 */
class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

// Seam: Choose active adapter dynamically based on runtime capability
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const storage: StorageAdapter = isStorageAvailable()
  ? new LocalStorageAdapter()
  : new MemoryStorageAdapter();
