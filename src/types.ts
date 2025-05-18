export type IndexedDbStoreMutations<T> = {
  setValue: (id: string, value: T) => Promise<void>;
  deleteValue: (id: string) => Promise<void>;
  updateValue: (id: string, value: T) => Promise<void>;
};

export type IndexedDbStore<T> = {
  values: Record<string, T>;
  mutations: IndexedDbStoreMutations<T>;
  isLoading: boolean;
  error: Error | null;
};

export type IndexedDbStoreParams = {
  schema?: IDBObjectStoreParameters;
};
