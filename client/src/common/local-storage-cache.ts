import { Cache } from "./cache";

class LocalStorageCache implements Cache {
  constructor() {}
  async get(key: string): Promise<any> {
    let response = localStorage.getItem(key);

    if (!response) {
      return null;
    }

    try {
      response = JSON.parse(response);
    } catch (e) {
      // Do nothing
    }

    return response;
  }

  async set(key: string, value: any): Promise<void> {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  async del(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async getAllKeys(): Promise<string[]> {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i) as string);
    }

    return keys;
  }

  async flush(): Promise<void> {
    localStorage.clear();
  }
}

export { LocalStorageCache };
