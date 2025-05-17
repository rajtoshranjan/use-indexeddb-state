export type IndexedDbStore<T> = {
  values: Record<string, T>;
  setValue: (id: string, value: T) => void;
  deleteValue: (id: string) => void;
};

export type IndexedDbStoreParams = {
  schema?: IDBObjectStoreParameters;
};
