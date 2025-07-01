import { useCallback, useMemo, useSyncExternalStore } from "react";

const subscribe = (key: string) => {
  return (cb: () => void) => {
    const storageCb = (ev: StorageEvent) => {
      if (ev.key === key) {
        cb();
      }
    };
    window.addEventListener("storage", storageCb);
    return () => {
      window.removeEventListener("storage", storageCb);
    };
  };
};

const useLocalStorage = (key: string) => {
  const subscribed = useMemo(() => subscribe(key), [key]);

  const storage = useSyncExternalStore(
    subscribed,
    () => window.localStorage.getItem(key),
    () => ""
  );

  const setStorage = useCallback(
    (value: string) => {
      window.localStorage.setItem(key, value);
    },
    [key]
  );

  return [storage, setStorage] as const;
};

const CHAT_USAGE_KEY = "chat-usage";

export const useUsage = () => {
  const [storageString, setStorage] = useLocalStorage(CHAT_USAGE_KEY);
  return {
    usage: Number(storageString ? storageString : "0"),
    setUsage: (value: number) => {
      setStorage(value.toString());
    },
  };
};
