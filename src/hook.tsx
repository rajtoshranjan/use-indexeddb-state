import { useEffect, useState } from "react";
import { Store } from "./store";
import { IndexedDbState, IndexedDbStateParams } from "./types";

export const useIndexedDbState = <T,>(
  key: string,
  { schema }: IndexedDbStateParams = {}
): IndexedDbState<T> => {
  // States.
  const [values, setValues] = useState<Record<string, T>>({});

  // Constants.
  const store = new Store<T>(key, schema);

  // useEffects.
  useEffect(() => {
    store.getAllItems().then((values) => {
      setValues(values);
    });
  }, [store]);

  // Handlers.
  const setValue = (id: string, value: T) => {
    store.setItem(id, value);
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const deleteValue = (id: string) => {
    store.deleteItem(id);
    setValues((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return { values, setValue, deleteValue };
};
