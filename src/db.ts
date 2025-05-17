import { idbRequestToPromise } from "./helpers";

export class DB {
  private static instance: DB;
  private indexedDB: IDBDatabase | null = null;

  private async getOrCreateIndexedDB(): Promise<IDBDatabase> {
    if (!this.indexedDB) {
      const request = indexedDB.open("use-idb-store", 1);
      this.indexedDB = await idbRequestToPromise<IDBDatabase>(request);
    }

    return this.indexedDB;
  }

  public static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  async createStore(name: string, schema?: IDBObjectStoreParameters) {
    const db = await this.getOrCreateIndexedDB();
    db.createObjectStore(name, schema);
  }

  async getStore(name: string) {
    const db = await this.getOrCreateIndexedDB();
    return db.transaction(name, "readwrite").objectStore(name);
  }

  async clearStore(name: string) {
    const store = await this.getStore(name);
    store.clear();
  }

  async deleteStore(name: string) {
    const db = await this.getOrCreateIndexedDB();
    db.deleteObjectStore(name);
  }
}
