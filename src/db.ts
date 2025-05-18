import { idbRequestToPromise } from "./helpers";

export class DB {
  private static instance: DB;
  private indexedDB: IDBDatabase | null = null;
  private stores: Map<string, IDBObjectStoreParameters | undefined> = new Map();
  private version = 1;

  private constructor() {}

  private async getOrCreateIndexedDB(): Promise<IDBDatabase> {
    if (this.indexedDB) {
      return this.indexedDB;
    }

    // Try to open the database with the current version
    try {
      const request = indexedDB.open("use-idb-store", this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create any stores that were registered before the database was opened.
        this.stores.forEach((schema, name) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, schema);
          }
        });
      };

      this.indexedDB = await idbRequestToPromise<IDBDatabase>(request);
      return this.indexedDB;
    } catch (error) {
      // If the error is about version not being higher, we need to increment and try again
      console.log("Database error, upgrading version", error);
      if (this.indexedDB) {
        this.indexedDB.close();
        this.indexedDB = null;
      }

      // Increment version and try again with a new request
      this.version++;
      const request = indexedDB.open("use-idb-store", this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create any stores that were registered
        this.stores.forEach((schema, name) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, schema);
          }
        });
      };

      this.indexedDB = await idbRequestToPromise<IDBDatabase>(request);
      return this.indexedDB;
    }
  }

  public static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  async createStore(name: string, schema?: IDBObjectStoreParameters) {
    // Register the store to be created when the database opens or upgrades
    this.stores.set(name, schema);

    // If database is already open, we need to close it and reopen with a higher version
    if (this.indexedDB) {
      const storeExists = this.indexedDB.objectStoreNames.contains(name);

      if (storeExists) {
        console.warn(`Store "${name}" already exists`);
        return;
      }

      // Close current connection and set indexedDB to null to force reopening
      this.indexedDB.close();
      this.indexedDB = null;
      this.version++;
    }

    // This will reopen with the new version and create the store in onupgradeneeded
    await this.getOrCreateIndexedDB();
  }

  async getStore(name: string) {
    const db = await this.getOrCreateIndexedDB();

    try {
      return db.transaction(name, "readwrite").objectStore(name);
    } catch (error) {
      // If the store doesn't exist yet, try to create it first
      if (!this.stores.has(name)) {
        await this.createStore(name);
        return db.transaction(name, "readwrite").objectStore(name);
      }
      throw error;
    }
  }

  async clearStore(name: string) {
    const store = await this.getStore(name);
    store.clear();
  }

  async deleteStore(name: string) {
    // Store deletion requires a version change, so we need to close and reopen
    if (this.indexedDB) {
      this.indexedDB.close();
      this.indexedDB = null;
      this.version++;

      const request = indexedDB.open("use-idb-store", this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (db.objectStoreNames.contains(name)) {
          db.deleteObjectStore(name);
        }
      };

      this.indexedDB = await idbRequestToPromise<IDBDatabase>(request);
      // Remove from our registry
      this.stores.delete(name);
    }
  }
}
