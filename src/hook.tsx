import { useEffect, useState, useRef } from "react";
import { Store } from "./store";
import { IndexedDbStore, IndexedDbStoreParams } from "./types";

export const useIndexedDbStore = <T,>(
  name: string,
  { schema }: IndexedDbStoreParams = {}
): IndexedDbStore<T> => {
  // States.
  const [values, setValues] = useState<Record<string, T>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref for the store to avoid recreating it on every render
  const storeRef = useRef<Store<T> | null>(null);

  // Initialize the store only once
  if (!storeRef.current) {
    storeRef.current = new Store<T>(name, schema);
  }

  // Load data on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (!storeRef.current) return;

        setIsLoading(true);
        setError(null);

        const data = await storeRef.current.getAllItems();

        if (isMounted) {
          setValues(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading indexed DB data:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [name]); // Re-run if store name changes

  // Handlers.
  const setValue = async (id: string, value: T) => {
    if (!storeRef.current) return;

    try {
      await storeRef.current.setItem(id, value);
      setValues((prev) => ({ ...prev, [id]: value }));
    } catch (err) {
      console.error(`Error setting value for ID ${id}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const deleteValue = async (id: string) => {
    if (!storeRef.current) return;

    try {
      await storeRef.current.deleteItem(id);
      setValues((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      console.error(`Error deleting value for ID ${id}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return { values, setValue, deleteValue, isLoading, error };
};
