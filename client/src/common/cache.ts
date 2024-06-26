interface Cache {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
  del: (key: string) => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  flush: () => Promise<void>;
}

export type { Cache };
