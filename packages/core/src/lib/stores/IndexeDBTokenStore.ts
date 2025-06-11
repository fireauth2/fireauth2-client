import {
  AuthTokenStore,
  AuthorizationSuccessResponseParams,
} from '../contracts';

const DB_NAME = 'fireauth';
const STORE_NAME = 'session';
const DB_VERSION = 1;
const TOKEN_KEY = 'default';

export class IndexedDBTokenStore implements AuthTokenStore {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('IndexedDBTokenStore must not be used on the server.');
    }

    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getStore(
    mode: IDBTransactionMode = 'readonly',
  ): Promise<IDBObjectStore> {
    const db = await this.dbPromise;
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
  }

  async get(): Promise<AuthorizationSuccessResponseParams | null> {
    const store = await this.getStore();
    return new Promise((resolve, reject) => {
      const request = store.get(TOKEN_KEY);
      request.onsuccess = () => {
        resolve(request.result ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set(token: AuthorizationSuccessResponseParams | null): Promise<void> {
    const store = await this.getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = token
        ? store.put(token, TOKEN_KEY)
        : store.delete(TOKEN_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    return this.set(null);
  }
}
