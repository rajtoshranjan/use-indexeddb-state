import { DB } from "./db";
import { idbRequestToPromise } from "./helpers";

export class Store<T = any> {
  protected name: string;
  private db: DB;
  private schema?: IDBObjectStoreParameters;

  constructor(name: string, schema?: IDBObjectStoreParameters) {
    this.db = DB.getInstance();

    this.name = name;
    this.schema = schema;
    this.setup();
  }

  async setup() {
    await this.db.createStore(this.name, this.schema);
  }

  get store() {
    return this.db.getStore(this.name);
  }

  async getItem(key: string): Promise<T | null> {
    const store = await this.store;
    const request = store.get(key);
    return idbRequestToPromise<T | null>(request);
  }

  async getAllItems(): Promise<Record<string, T>> {
    const store = await this.store;
    const request = store.getAll();
    const data = await idbRequestToPromise<T[]>(request);
    return data.reduce((acc, item) => {
      // @ts-ignore
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, T>);
  }

  async setItem(key: string, value: T): Promise<IDBValidKey> {
    const store = await this.store;
    const request = store.put(value, key);
    return idbRequestToPromise<IDBValidKey>(request);
  }

  async deleteItem(key: string): Promise<void> {
    const store = await this.store;
    const request = store.delete(key);
    await idbRequestToPromise<void>(request);
  }

  async clear() {
    const store = await this.store;
    store.clear();
  }

  async destroy() {
    const store = await this.store;
    store.delete(this.name);
  }
}
