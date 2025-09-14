"use client";

import { useCallback, useSyncExternalStore } from "react";
import { ModelId, Provider } from "../app/types";

const subscribers = new Map<string, Set<() => void>>();

const getSubscribers = (key: string) => {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  return subscribers.get(key)!;
};

const useLocalStorage = (key: string) => {
  const subscribe = useCallback(
    (cb: () => void) => {
      const subs = getSubscribers(key);
      subs.add(cb);
      return () => subs.delete(cb);
    },
    [key]
  );

  const storage = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key),
    () => ""
  );

  const setStorage = useCallback(
    (value: string) => {
      window.localStorage.setItem(key, value);
      getSubscribers(key).forEach((cb) => cb());
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

const ASSIST_DESCRIPTION_KEY = "chat-assistant-description";

export const useAssistant = () => {
  const [value, setValue] = useLocalStorage(ASSIST_DESCRIPTION_KEY);
  return {
    assystentDescription: value ?? undefined,
    setAssysDescription: setValue,
  };
};

const API_KEY = "chat-api-key";

export const useApikey = () => {
  const [apiKey, setApiKey] = useLocalStorage(API_KEY);
  return { apiKey: apiKey ?? undefined, setApiKey };
};

const PROVIDER_KEY = "provider-key";

export const useProvider = () => {
  const [provider, setProvider] = useLocalStorage(PROVIDER_KEY);
  return {
    provider: provider ? (provider as Provider) : undefined,
    setProvider: (provider: Provider) => {
      setProvider(provider);
    },
  };
};

const MODEL_KEY = "model-key";

export const useModel = () => {
  const [model, setModel] = useLocalStorage(MODEL_KEY);
  return {
    model: model ? (model as ModelId) : undefined,
    setModel: (modelId: ModelId) => {
      setModel(modelId);
    },
  };
};
