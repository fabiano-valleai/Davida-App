import { MMKV } from "react-native-mmkv";
import { LocalStorageKey } from "src/types/localStorageKey";

export const mmkvStorage = new MMKV({
  id: "davida-storage",
  encryptionKey: "hunter2",
});

export const useLocalStorage = () => {
  const set = (key: LocalStorageKey, value: string | undefined) => {
    if (value === undefined) {
      mmkvStorage.delete(key);
    } else {
      mmkvStorage.set(key, value);
    }
  };

  const get = (key: LocalStorageKey) => mmkvStorage.getString(key);

  return { set, get };
};
