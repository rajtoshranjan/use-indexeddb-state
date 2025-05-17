export type IndexedDbState<T> = {
  values: Record<string, T>;
  setValue: (id: string, value: T) => void;
  deleteValue: (id: string) => void;
};

export type IndexedDbStateParams = {
  schema?: IDBObjectStoreParameters;
};
