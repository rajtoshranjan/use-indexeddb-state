import { DB } from "./db";
import { idbRequestToPromise } from "./helpers";

export class Store<T = any> {
  protected name: string;
  private db: DB;
  private schema?: IDBObjectStoreParameters;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(name: string, schema?: IDBObjectStoreParameters) {
    this.db = DB.getInstance();
    this.name = name;
    this.schema = schema;
    // Start setup immediately but don't wait for it
    this.initPromise = this.setup();
  }

  async setup() {
    try {
      await this.db.createStore(this.name, this.schema);
      this.isInitialized = true;
    } catch (error) {
      console.error(`Error setting up store ${this.name}:`, error);
      throw error;
    }
  }

  // Ensure the store is initialized before any operations
  private async ensureInitialized() {
    if (!this.isInitialized) {
      if (this.initPromise) {
        await this.initPromise;
      } else {
        this.initPromise = this.setup();
        await this.initPromise;
      }
    }
  }

  private async getStore() {
    await this.ensureInitialized();
    return this.db.getStore(this.name);
  }

  async getItem(key: string): Promise<T | null> {
    try {
      const store = await this.getStore();
      const request = store.get(key);
      return idbRequestToPromise<T | null>(request);
    } catch (error) {
      console.error(
        `Error getting item ${key} from store ${this.name}:`,
        error
      );
      return null;
    }
  }

  async getAllItems(): Promise<Record<string, T>> {
    try {
      const store = await this.getStore();
      const request = store.getAll();
      const data = await idbRequestToPromise<T[]>(request);
      return data.reduce((acc, item) => {
        // @ts-ignore
        const id = item.id || crypto.randomUUID();
        // @ts-ignore
        acc[id] = item;
        return acc;
      }, {} as Record<string, T>);
    } catch (error) {
      console.error(`Error getting all items from store ${this.name}:`, error);
      return {};
    }
  }

  async setItem(key: string, value: T): Promise<IDBValidKey> {
    try {
      const store = await this.getStore();
      const request = store.put(value, key);
      return idbRequestToPromise<IDBValidKey>(request);
    } catch (error) {
      console.error(`Error setting item ${key} in store ${this.name}:`, error);
      throw error;
    }
  }

  async deleteItem(key: string): Promise<void> {
    try {
      const store = await this.getStore();
      const request = store.delete(key);
      await idbRequestToPromise<void>(request);
    } catch (error) {
      console.error(
        `Error deleting item ${key} from store ${this.name}:`,
        error
      );
      throw error;
    }
  }

  async clear() {
    try {
      const store = await this.getStore();
      store.clear();
    } catch (error) {
      console.error(`Error clearing store ${this.name}:`, error);
      throw error;
    }
  }

  async destroy() {
    try {
      await this.db.deleteStore(this.name);
    } catch (error) {
      console.error(`Error destroying store ${this.name}:`, error);
      throw error;
    }
  }
}
